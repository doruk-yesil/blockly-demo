<template>
  <div class="blockly-playground">
    <q-select v-model="selectedLang" :options="supportedLanguages" label="Dil Seçin" emit-value map-options dense
      outlined class="q-mb-md" />
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
      <q-dialog v-model="variableDialog.visible" persistent>
        <q-card style="min-width: 350px; max-height: 80vh; overflow: auto;">
          <q-card-section>
            <div class="text-h6">Değişken Seç</div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="variableDialog.search" dense outlined placeholder="Ara..." debounce="0" />
            <q-list bordered separator class="q-mt-sm" style="max-height: 300px; overflow-y: auto;">
              <q-item v-for="variable in filteredVariables" :key="variable.name" clickable v-ripple
                :active="variableDialog.selected === variable.name" @click="variableDialog.selected = variable.name">
                <q-item-section>{{ variable.name }}</q-item-section>
                <q-item-section side class="text-caption text-grey">{{ variable.type }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="İptal" v-close-popup />
            <q-btn flat label="Seç" color="primary" @click="applyVariableSelection"
              :disable="!variableDialog.selected" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import { phpGenerator } from 'blockly/php'
import { getToolbox, getBlocklyLocale } from './toolbox/index' // defineVariablesBlocks'a gerek yok, index.ts zaten çağırıyor
import { QBtn, QBtnToggle, QCard, QCardSection, QSplitter, QSelect, QDialog, QCardActions, QItem, QInput, QItemSection, QList } from 'quasar'
import { i18n } from '../i18n'

const blocklyDiv = ref<HTMLDivElement>()
const splitterModel = ref(60)
const selectedLanguage = ref('json')
const generatedCode = ref('')
const output = ref('')
const selectedLang = ref('en');
const variableDialog = ref({
  visible: false,
  selected: '',
  search: '',
  targetField: null as Blockly.Field | null
})
const supportedLanguages = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'French', value: 'fr' },
  { label: 'Türkçe', value: 'tr' },
];
const languageOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'JS', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'PHP', value: 'php' },
]
const variableDictionary = [
  { name: 'client_id', type: 'string' },
  { name: 'invoice_total', type: 'number' },
  { name: 'is_active', type: 'boolean' }
]
const filteredVariables = computed(() =>
  variableDictionary.filter(v =>
    v.name.toLowerCase().includes(variableDialog.value.search.toLowerCase())
  )
)

let workspace: Blockly.WorkspaceSvg | null = null

const setBlocklyLocale = async (langCode: string) => {
  try {
    const localeModule = await getBlocklyLocale(langCode)
    Blockly.setLocale(localeModule as any)
    i18n.global.locale.value = langCode as "de" | "en" | "fr" | "tr"
    if (workspace) {
      const xml = Blockly.Xml.workspaceToDom(workspace)
      workspace.dispose()
      await nextTick()
      workspace = Blockly.inject(blocklyDiv.value!, {
        toolbox: getToolbox(undefined), // getToolbox'a workspace argümanı geçildi
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
      if (workspace) {
        workspace.updateToolbox(getToolbox(workspace));
      }
      Blockly.Xml.domToWorkspace(xml, workspace)
    }
  } catch (err) {
    console.error(`Locale yüklenemedi: ${langCode}`, err)
  }
}

watch(selectedLang, (newLang) => {
  setBlocklyLocale(newLang)
})

const initBlockly = async () => {
  await nextTick()
  if (!blocklyDiv.value) return
  defineMainBlock()
  workspace = Blockly.inject(blocklyDiv.value, {
    toolbox: getToolbox(undefined),
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
  if (workspace) {
    workspace.updateToolbox(getToolbox(workspace));
  }
  workspace.addChangeListener(generateCode)
  addMainBlock()
  workspace.addChangeListener((e) => {
    if (e.type === Blockly.Events.VAR_CREATE || e.type === Blockly.Events.VAR_DELETE || e.type === Blockly.Events.VAR_RENAME) {
      workspace?.updateToolbox(getToolbox(workspace))
    }
  })
}

const defineMainBlock = () => {
  Blockly.Blocks['main_block'] = {
    init: function () {
      this.appendStatementInput("MAIN_CODE")
        .setCheck(null)
        .appendField(i18n.global.t('blocks.main_title'))
      this.appendValueInput("RETURN")
        .setCheck(null)
        .appendField(i18n.global.t('blocks.main_return'))
      this.setColour('#6e1c00')
      this.setTooltip(i18n.global.t('blocks.main_tooltip'))
      this.setHelpUrl("")
      this.setDeletable(false)
      this.setMovable(true)
    }
  }
}

const addMainBlock = () => {
  if (!workspace) return
  const xml = Blockly.utils.xml.textToDom(`
    <xml>
      <block type="main_block" deletable="false" movable="true" x="50" y="30"></block>
    </xml>
  `)
  Blockly.Xml.domToWorkspace(xml, workspace)
}

const generateCode = () => {
  if (!workspace) return
  const mainBlock = workspace.getTopBlocks(true).find(b => b.type === 'main_block')
  if (!mainBlock) {
    generatedCode.value = '// Ana Blok bulunamadı.'
    return
  }
  const mainCode = (() => {
    switch (selectedLanguage.value) {
      case 'javascript':
        return javascriptGenerator.blockToCode(mainBlock)
      case 'python':
        return pythonGenerator.blockToCode(mainBlock)
      case 'php':
        return phpGenerator.blockToCode(mainBlock)
      case 'json':
        const json = Blockly.serialization.workspaces.save(workspace)
        if (json && json.variables) {
          const variableTypeMap: { [id: string]: string } = {};
          workspace.getAllBlocks(false).forEach(block => {
            if (block.type === 'variable_define_custom') {
              const varField = block.getField('VAR') as Blockly.FieldVariable;
              const variableModel = varField.getVariable();
              if (variableModel) {
                const varId = variableModel.getId();
                const varType = block.getFieldValue('VAR_TYPE');
                if (varId && varType) {
                  variableTypeMap[varId] = varType;
                }
              }
            }
          });

          json.variables.forEach((variable: any) => {
            if (variableTypeMap[variable.id]) {
              variable.type = variableTypeMap[variable.id];
            } else {
              variable.type = 'unknown';
            }
          });
        }
        return JSON.stringify(json, null, 2)
      default:
        return '// Dil desteklenmiyor'
    }
  })()
  generatedCode.value = Array.isArray(mainCode) ? mainCode[0] : mainCode || '// Kod üretilmedi'
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
  if (!workspace) return
  const blocks = workspace.getTopBlocks(true)
  for (const block of blocks) {
    if (block.type !== 'main_block') {
      block.dispose(false, true)
    }
  }
  output.value = ''
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
  window.addEventListener('open-variable-selector', (e: any) => {
    variableDialog.value.visible = true
    variableDialog.value.selected = e.detail.currentValue
    variableDialog.value.targetField = e.detail.field
  })
})

const applyVariableSelection = () => {
  const field = variableDialog.value.targetField
  if (field && typeof field.setValue === 'function') {
    field.setValue(variableDialog.value.selected)
  }
  variableDialog.value.visible = false
}

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