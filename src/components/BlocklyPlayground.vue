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

const languageOptions = [
  { label: 'JS', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'PHP', value: 'php' }
]

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
      name: 'Custom',
      colour: '#9A5CA6',
      contents: [
        { kind: 'block', type: 'custom_choice' }
      ]
    },
  ]
}

const initBlockly = async () => {
  await nextTick()
  if (!blocklyDiv.value) return
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

const addSampleBlocks = () => {
  if (!workspace) return

  const xml = Blockly.utils.xml.textToDom(`
    <xml>
      <block type="text_print" x="50" y="50">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">Hello, Blockly with Vue 3!</field>
          </shadow>
        </value>
      </block>
    </xml>
  `)
  Blockly.Xml.domToWorkspace(xml, workspace)
}

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

const clearWorkspace = () => {
  if (workspace) {
    workspace.clear()
    output.value = ''
  }
}

const saveWorkspace = () => {
  if (!workspace) return
  const xml = Blockly.Xml.workspaceToDom(workspace)
  const xmlText = Blockly.Xml.domToText(xml)
  localStorage.setItem('blockly_workspace', xmlText)
  console.log('Workspace saved!')
}

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