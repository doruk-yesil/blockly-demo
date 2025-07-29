<template>
  <div class="blockly-playground">
    <q-splitter v-model="splitterModel" style="height: 80vh">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Visual Editor</div>
          <div ref="blocklyDiv" class="blockly-workspace" style="height: 70vh; width: 100%; border: 1px solid #ddd;">
          </div>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-h6 q-mr-md">Generated Code</div>
            <q-btn-toggle v-model="selectedLanguage" toggle-color="primary" size="sm" :options="languageOptions"
              @update:model-value="generateCode" />
          </div>

          <q-card class="q-mb-md">
            <q-card-section class="q-pa-sm">
              <pre class="code-output">{{ generatedCode }}</pre>
            </q-card-section>
          </q-card>

          <div class="row q-gutter-sm">
            <q-btn color="primary" label="Run JavaScript" @click="runCode" :disable="selectedLanguage !== 'javascript'"
              size="sm" />
            <q-btn color="negative" label="Clear" @click="clearWorkspace" size="sm" />
            <q-btn color="secondary" label="Save" @click="saveWorkspace" size="sm" />
            <q-btn color="info" label="Load" @click="loadWorkspace" size="sm" />
          </div>

          <q-card v-if="output" class="q-mt-md">
            <q-card-section>
              <div class="text-subtitle2">Output:</div>
              <div class="output-text">{{ output }}</div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import { phpGenerator } from 'blockly/php'
import { QBtn, QBtnToggle, QCard, QCardSection, QSplitter } from 'quasar'

const blocklyDiv = ref<HTMLDivElement>()
const splitterModel = ref(60)
const selectedLanguage = ref('javascript')
const generatedCode = ref('')
const output = ref('')

let workspace: Blockly.WorkspaceSvg | null = null

// Language options for the toggle
const languageOptions = [
  { label: 'JS', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'PHP', value: 'php' }
]

// Blockly toolbox configuration
const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'logic_null' },
        { kind: 'block', type: 'logic_ternary' },
      ]
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '#5CA65C',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
        { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' },
      ]
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '#5C68A6',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_trig' },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_on_list' },
        { kind: 'block', type: 'math_modulo' },
        { kind: 'block', type: 'math_constrain' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_random_float' },
      ]
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '#5CA68D',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_append' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_isEmpty' },
        { kind: 'block', type: 'text_indexOf' },
        { kind: 'block', type: 'text_charAt' },
        { kind: 'block', type: 'text_getSubstring' },
        { kind: 'block', type: 'text_changeCase' },
        { kind: 'block', type: 'text_trim' },
        { kind: 'block', type: 'text_print' },
        { kind: 'block', type: 'text_prompt_ext' },
      ]
    },
    {
      kind: 'category',
      name: 'Lists',
      colour: '#745CA6',
      contents: [
        { kind: 'block', type: 'lists_create_with' },
        { kind: 'block', type: 'lists_repeat' },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_isEmpty' },
        { kind: 'block', type: 'lists_indexOf' },
        { kind: 'block', type: 'lists_getIndex' },
        { kind: 'block', type: 'lists_setIndex' },
        { kind: 'block', type: 'lists_getSublist' },
        { kind: 'block', type: 'lists_split' },
        { kind: 'block', type: 'lists_sort' },
      ]
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#A65C81',
      custom: 'VARIABLE'
    },
    {
      kind: 'category',
      name: 'Functions',
      colour: '#9A5CA6',
      custom: 'PROCEDURE'
    },
    {
      kind: 'category',
      name: 'Custom Blocks',
      colour: '#FF6B35',
      contents: [
        { kind: 'block', type: 'database_query' },
        { kind: 'block', type: 'api_request' },
        { kind: 'block', type: 'send_email' },
        { kind: 'block', type: 'file_operation' },
        { kind: 'block', type: 'validate_input' },
      ]
    },
  ]
}

// Initialize Blockly workspace
const initBlockly = async () => {
  await nextTick()
  if (!blocklyDiv.value) return
  defineCustomBlocks()
  workspace = Blockly.inject(blocklyDiv.value, {
    toolbox: toolbox,
    theme: Blockly.Themes.Classic,
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    trashcan: true,
    scrollbars: true,
    sounds: false,
    oneBasedIndex: true,
  })
  workspace.addChangeListener(generateCode)
  addSampleBlocks()
}

// Define custom user role block
const defineCustomBlocks = () => {
  // 1. Database Query Block
  Blockly.Blocks['database_query'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Query database")
        .appendField(new Blockly.FieldDropdown([
          ["SELECT", "SELECT"],
          ["INSERT", "INSERT"],
          ["UPDATE", "UPDATE"],
          ["DELETE", "DELETE"]
        ]), "OPERATION")
      this.appendValueInput("TABLE")
        .setCheck("String")
        .appendField("table")
      this.appendValueInput("CONDITIONS")
        .setCheck("String")
        .appendField("where")
      this.setOutput(true, "Array")
      this.setColour('#2196F3')
      this.setTooltip("Execute database operations")
    }
  }

  // 2. API Request Block
  Blockly.Blocks['api_request'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("API")
        .appendField(new Blockly.FieldDropdown([
          ["GET", "GET"],
          ["POST", "POST"],
          ["PUT", "PUT"],
          ["DELETE", "DELETE"]
        ]), "METHOD")
      this.appendValueInput("URL")
        .setCheck("String")
        .appendField("to")
      this.appendValueInput("HEADERS")
        .setCheck("String")
        .appendField("headers")
      this.appendValueInput("BODY")
        .setCheck("String")
        .appendField("body")
      this.setOutput(true, "String")
      this.setColour('#FF9800')
      this.setTooltip("Make HTTP API requests")
    }
  }

  // 3. Email Notification Block
  Blockly.Blocks['send_email'] = {
    init: function () {
      this.appendValueInput("TO")
        .setCheck("String")
        .appendField("Send email to")
      this.appendValueInput("SUBJECT")
        .setCheck("String")
        .appendField("subject")
      this.appendValueInput("BODY")
        .setCheck("String")
        .appendField("message")
      this.appendDummyInput()
        .appendField("priority")
        .appendField(new Blockly.FieldDropdown([
          ["low", "LOW"],
          ["normal", "NORMAL"],
          ["high", "HIGH"],
          ["urgent", "URGENT"]
        ]), "PRIORITY")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#4CAF50')
      this.setTooltip("Send email notifications")
    }
  }

  // 4. File System Block
  Blockly.Blocks['file_operation'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["Read file", "READ"],
          ["Write file", "WRITE"],
          ["Delete file", "DELETE"],
          ["Create folder", "MKDIR"]
        ]), "OPERATION")
      this.appendValueInput("PATH")
        .setCheck("String")
        .appendField("path")
      this.appendValueInput("CONTENT")
        .setCheck("String")
        .appendField("content")
      this.setOutput(true, "String")
      this.setColour('#9C27B0')
      this.setTooltip("File system operations")
    }
  }

  // 5. Validation Block
  Blockly.Blocks['validate_input'] = {
    init: function () {
      this.appendValueInput("INPUT")
        .setCheck("String")
        .appendField("Validate")
      this.appendDummyInput()
        .appendField("as")
        .appendField(new Blockly.FieldDropdown([
          ["email", "EMAIL"],
          ["phone", "PHONE"],
          ["credit card", "CREDIT_CARD"],
          ["URL", "URL"],
          ["IP address", "IP"],
          ["date", "DATE"]
        ]), "TYPE")
      this.setOutput(true, "Boolean")
      this.setColour('#FF5722')
      this.setTooltip("Validate input formats")
    }
  }

  // Code generators for database query
  javascriptGenerator.forBlock['database_query'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const table = generator.valueToCode(block, 'TABLE', generator.ORDER_ATOMIC || 0) || '""'
    const conditions = generator.valueToCode(block, 'CONDITIONS', generator.ORDER_ATOMIC || 0) || '""'
    const code = `db.${operation.toLowerCase()}(${table}, ${conditions})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['database_query'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const table = generator.valueToCode(block, 'TABLE', generator.ORDER_ATOMIC || 0) || '""'
    const conditions = generator.valueToCode(block, 'CONDITIONS', generator.ORDER_ATOMIC || 0) || '""'
    const code = `db.${operation.toLowerCase()}(${table}, ${conditions})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['database_query'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const table = generator.valueToCode(block, 'TABLE', generator.ORDER_ATOMIC || 0) || '""'
    const conditions = generator.valueToCode(block, 'CONDITIONS', generator.ORDER_ATOMIC || 0) || '""'
    const code = `$db->${operation.toLowerCase()}(${table}, ${conditions})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  // Code generators for API request
  javascriptGenerator.forBlock['api_request'] = function (block: any, generator: any) {
    const method = block.getFieldValue('METHOD')
    const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC || 0) || '""'
    const headers = generator.valueToCode(block, 'HEADERS', generator.ORDER_ATOMIC || 0) || '{}'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || 'null'
    const code = `fetch(${url}, {method: '${method}', headers: ${headers}, body: ${body}})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['api_request'] = function (block: any, generator: any) {
    const method = block.getFieldValue('METHOD')
    const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC || 0) || '""'
    const headers = generator.valueToCode(block, 'HEADERS', generator.ORDER_ATOMIC || 0) || '{}'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || 'None'
    const code = `requests.${method.toLowerCase()}(${url}, headers=${headers}, data=${body})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['api_request'] = function (block: any, generator: any) {
    const method = block.getFieldValue('METHOD')
    const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC || 0) || '""'
    const headers = generator.valueToCode(block, 'HEADERS', generator.ORDER_ATOMIC || 0) || 'array()'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || 'null'
    const code = `curl_request('${method}', ${url}, ${headers}, ${body})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  // Code generators for email
  javascriptGenerator.forBlock['send_email'] = function (block: any, generator: any) {
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ATOMIC || 0) || '""'
    const subject = generator.valueToCode(block, 'SUBJECT', generator.ORDER_ATOMIC || 0) || '""'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || '""'
    const priority = block.getFieldValue('PRIORITY')
    const code = `emailService.send({to: ${to}, subject: ${subject}, body: ${body}, priority: '${priority}'})\n`
    return code
  }

  pythonGenerator.forBlock['send_email'] = function (block: any, generator: any) {
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ATOMIC || 0) || '""'
    const subject = generator.valueToCode(block, 'SUBJECT', generator.ORDER_ATOMIC || 0) || '""'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || '""'
    const priority = block.getFieldValue('PRIORITY')
    const code = `send_email(to=${to}, subject=${subject}, body=${body}, priority='${priority}')\n`
    return code
  }

  phpGenerator.forBlock['send_email'] = function (block: any, generator: any) {
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ATOMIC || 0) || '""'
    const subject = generator.valueToCode(block, 'SUBJECT', generator.ORDER_ATOMIC || 0) || '""'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || '""'
    const priority = block.getFieldValue('PRIORITY')
    const code = `mail(${to}, ${subject}, ${body}, ['Priority' => '${priority}'])\n`
    return code
  }

  // Code generators for file operations
  javascriptGenerator.forBlock['file_operation'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC || 0) || '""'
    const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC || 0) || '""'
    let code = ''
    switch (operation) {
      case 'READ': code = `fs.readFileSync(${path}, 'utf8')`; break
      case 'write': code = `fs.writeFileSync(${path}, ${content})`; break
      case 'delete': code = `fs.unlinkSync(${path})`; break
      case 'mkdir': code = `fs.mkdirSync(${path})`; break
    }
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['file_operation'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC || 0) || '""'
    const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC || 0) || '""'
    let code = ''
    switch (operation) {
      case 'read': code = `open(${path}, 'r').read()`; break
      case 'write': code = `open(${path}, 'w').write(${content})`; break
      case 'delete': code = `os.remove(${path})`; break
      case 'mkdir': code = `os.makedirs(${path})`; break
    }
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['file_operation'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC || 0) || '""'
    const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC || 0) || '""'
    let code = ''
    switch (operation) {
      case 'read': code = `file_get_contents(${path})`; break
      case 'write': code = `file_put_contents(${path}, ${content})`; break
      case 'delete': code = `unlink(${path})`; break
      case 'mkdir': code = `mkdir(${path})`; break
    }
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  javascriptGenerator.forBlock['validate_input'] = function (block: any, generator: any) {
    const input = generator.valueToCode(block, 'INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const type = block.getFieldValue('TYPE')

    const code = `validator.is${type.toLowerCase().replace('_', '')}(${input})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['validate_input'] = function (block: any, generator: any) {
    const input = generator.valueToCode(block, 'INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const type = block.getFieldValue('TYPE')

    const code = `validate_${type.toLowerCase()}(${input})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['validate_input'] = function (block: any, generator: any) {
    const input = generator.valueToCode(block, 'INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const type = block.getFieldValue('TYPE')

    const code = `filter_var(${input}, FILTER_VALIDATE_${type})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }
}

// Add sample blocks to get started
const addSampleBlocks = () => {
  if (!workspace) return

  const xml = Blockly.utils.xml.textToDom(`
    <xml>
      <block type="send_email" x="50" y="50">
        <value name="TO">
          <shadow type="text">
            <field name="TEXT">user@example.com</field>
          </shadow>
        </value>
        <value name="SUBJECT">
          <shadow type="text">
            <field name="TEXT">Welcome!</field>
          </shadow>
        </value>
        <value name="BODY">
          <shadow type="text">
            <field name="TEXT">Thank you for joining us.</field>
          </shadow>
        </value>
        <field name="PRIORITY">NORMAL</field>
      </block>
      
      <block type="database_query" x="50" y="200">
        <field name="OPERATION">SELECT</field>
        <value name="TABLE">
          <shadow type="text">
            <field name="TEXT">users</field>
          </shadow>
        </value>
        <value name="CONDITIONS">
          <shadow type="text">
            <field name="TEXT">active = true</field>
          </shadow>
        </value>
      </block>
    </xml>
  `)

  Blockly.Xml.domToWorkspace(xml, workspace)
}

// Generate code based on selected language
const generateCode = () => {
  if (!workspace) return
  let code = ''
  switch (selectedLanguage.value) {
    case 'javascript':
      code = javascriptGenerator.workspaceToCode(workspace)
      break
    case 'python':
      code = pythonGenerator.workspaceToCode(workspace)
      break
    case 'php':
      code = phpGenerator.workspaceToCode(workspace)
      break
  }
  generatedCode.value = code || '// No blocks connected'
}

// Run JavaScript code
const runCode = () => {
  if (selectedLanguage.value !== 'javascript') return
  try {
    output.value = ''
    const originalLog = console.log
    const logs: string[] = []
    console.log = (...args: any[]) => {
      logs.push(args.map(arg => String(arg)).join(' '))
      originalLog(...args)
    }
    const result = eval(generatedCode.value)
    console.log = originalLog
    if (logs.length > 0) {
      output.value = logs.join('\n')
    } else if (result !== undefined) {
      output.value = String(result)
    } else {
      output.value = 'Code executed successfully'
    }
  } catch (error) {
    output.value = `Error: ${error}`
  }
}

// Clear workspace
const clearWorkspace = () => {
  if (workspace) {
    workspace.clear()
    output.value = ''
  }
}

// Save workspace to localStorage
const saveWorkspace = () => {
  if (!workspace) return
  const xml = Blockly.Xml.workspaceToDom(workspace)
  const xmlText = Blockly.Xml.domToText(xml)
  localStorage.setItem('blockly_workspace', xmlText)
  console.log('Workspace saved!')
}

// Load workspace from localStorage
const loadWorkspace = () => {
  if (!workspace) return

  const xmlText = localStorage.getItem('blockly_workspace')
  if (xmlText) {
    const xml = Blockly.utils.xml.textToDom(xmlText)
    workspace.clear()
    Blockly.Xml.domToWorkspace(xml, workspace)
    console.log('Workspace loaded!')
  }
}

onMounted(() => {
  initBlockly()
})

onUnmounted(() => {
  if (workspace) {
    workspace.dispose()
  }
})
</script>

<style scoped>
.blockly-playground {
  height: 100%;
}

.code-output {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-text {
  background-color: #e8f5e8;
  padding: 8px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}

.blockly-workspace {
  border-radius: 4px;
}
</style>