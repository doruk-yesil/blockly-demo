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

// Reactive refs
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
      name: 'User Management',
      colour: '#FF6B35',
      contents: [
        { kind: 'block', type: 'user_role_action' },
        { kind: 'block', type: 'create_user' },
      ]
    },
  ]
}

// Initialize Blockly workspace
const initBlockly = async () => {
  await nextTick()

  if (!blocklyDiv.value) return

  // Define custom blocks before injecting workspace
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

  // Listen for workspace changes
  workspace.addChangeListener(generateCode)

  // Add some sample blocks
  addSampleBlocks()
}

// Define custom user role block
const defineCustomBlocks = () => {
  // Define the user role action block
  Blockly.Blocks['user_role_action'] = {
    init: function () {
      this.appendValueInput("USER_INPUT")
        .setCheck("String")
        .appendField("User")
      this.appendDummyInput()
        .appendField("has role")
        .appendField(new Blockly.FieldDropdown([
          ["customer", "CUSTOMER"],
          ["manager", "MANAGER"],
          ["admin", "ADMIN"]
        ]), "ROLE")
      this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("do")
      this.setInputsInline(true)
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#FF6B35')
      this.setTooltip("Execute actions based on user role")
      this.setHelpUrl("")
    }
  }

  // JavaScript code generator for the custom block
  javascriptGenerator.forBlock['user_role_action'] = function (block: any, generator: any) {
    const userInput = generator.valueToCode(block, 'USER_INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const role = block.getFieldValue('ROLE')
    const statements = generator.statementToCode(block, 'DO')

    const code = `// User role check
if (${userInput} && "${role.toLowerCase()}" === "${role.toLowerCase()}") {
  console.log("User " + ${userInput} + " has ${role.toLowerCase()} role");
${statements}}
`
    return code
  }

  // Python code generator
  pythonGenerator.forBlock['user_role_action'] = function (block: any, generator: any) {
    const userInput = generator.valueToCode(block, 'USER_INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const role = block.getFieldValue('ROLE')
    const statements = generator.statementToCode(block, 'DO')

    const code = `# User role check
if ${userInput} and "${role.toLowerCase()}" == "${role.toLowerCase()}":
    print(f"User {${userInput}} has ${role.toLowerCase()} role")
${statements}`
    return code
  }

  // PHP code generator  
  phpGenerator.forBlock['user_role_action'] = function (block: any, generator: any) {
    const userInput = generator.valueToCode(block, 'USER_INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const role = block.getFieldValue('ROLE')
    const statements = generator.statementToCode(block, 'DO')

    const code = `// User role check
if (${userInput} && "${role.toLowerCase()}" === "${role.toLowerCase()}") {
    echo "User " . ${userInput} . " has ${role.toLowerCase()} role\\n";
${statements}}
`
    return code
  }

  // Define a simple user management block
  Blockly.Blocks['create_user'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Create user")
        .appendField(new Blockly.FieldTextInput("username"), "USERNAME")
      this.setOutput(true, "String")
      this.setColour('#4CAF50')
      this.setTooltip("Create a new user with given username")
      this.setHelpUrl("")
    }
  }

  // Code generators for create_user block
  javascriptGenerator.forBlock['create_user'] = function (block: any, generator: any) {
    const username = block.getFieldValue('USERNAME')
    const code = `"${username}"`
    return [code, generator.ORDER_ATOMIC || 0]
  }

  pythonGenerator.forBlock['create_user'] = function (block: any, generator: any) {
    const username = block.getFieldValue('USERNAME')
    const code = `"${username}"`
    return [code, generator.ORDER_ATOMIC || 0]
  }

  phpGenerator.forBlock['create_user'] = function (block: any, generator: any) {
    const username = block.getFieldValue('USERNAME')
    const code = `"${username}"`
    return [code, generator.ORDER_ATOMIC || 0]
  }
}

// Add sample blocks to get started
const addSampleBlocks = () => {
  if (!workspace) return

  const xml = Blockly.utils.xml.textToDom(`
    <xml>
      <block type="user_role_action" x="50" y="50">
        <value name="USER_INPUT">
          <block type="create_user">
            <field name="USERNAME">john_doe</field>
          </block>
        </value>
        <field name="ROLE">ADMIN</field>
        <statement name="DO">
          <block type="text_print">
            <value name="TEXT">
              <shadow type="text">
                <field name="TEXT">Admin access granted!</field>
              </shadow>
            </value>
          </block>
        </statement>
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

    // Capture console.log output
    const originalLog = console.log
    const logs: string[] = []

    console.log = (...args: any[]) => {
      logs.push(args.map(arg => String(arg)).join(' '))
      originalLog(...args)
    }

    // Execute the code
    const result = eval(generatedCode.value)

    // Restore console.log
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

  // Show success message (you can integrate with Quasar notify here)
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

// Lifecycle hooks
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