export const getBlocklyLocale = async (langCode: string) => {
  switch (langCode) {
    case 'de':
      return await import('blockly/msg/de')
    case 'fr':
      return await import('blockly/msg/fr')
    case 'tr':
      return await import('blockly/msg/tr')
    case 'en':
    default:
      return await import('blockly/msg/en')
  }
}

import { i18n } from '../../i18n'
import * as Blockly from 'blockly'
import { defineLogicBlocks } from './Logic'
import { defineMathBlocks } from './Math'
import { defineTextBlocks } from './Text'
import { defineOtherBlocks } from './Other'
import { defineObjectBlocks } from './Object'
import { defineVariablesBlocks } from './Variables'
import { defineLoopBlocks } from './Loop'

defineLogicBlocks()
defineMathBlocks()
defineTextBlocks()
defineOtherBlocks()
defineObjectBlocks()
defineVariablesBlocks()
defineLoopBlocks()
const generateVariableCategories = (workspace?: Blockly.Workspace): any[] => {
  if (!workspace) return []
  const variables = workspace.getAllVariables()
  return variables.map((variable) => ({
    kind: 'category',
    name: variable.getName(),
    colour: '#FF6B35',
    contents: [
      {
        kind: 'block',
        type: 'variable_custom',
        fields: {
          VAR: {
            name: variable.getName(),
            variableTypes: [''],
            variable: variable.getName()
          }
        }
      },
      {
        kind: 'block',
        type: 'variable_set_custom',
        fields: {
          VAR: {
            name: variable.getName(),
            variableTypes: [''],
            variable: variable.getName()
          }
        }
      },
    ]
  }))
}

export const getToolbox = (workspace?: Blockly.Workspace) => {
  const variableCategories = generateVariableCategories(workspace)
  return {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: i18n.global.t('categories.variables'),
        colour: '#FF6B35',
        contents: [
          { kind: 'block', type: 'variable_define_custom' },
          { kind: 'block', type: 'constant_custom' },
          { kind: 'block', type: 'variable_custom' },
          { kind: 'block', type: 'variable_set_custom' },
          { kind: 'block', type: 'variable_typeof_custom' },
        ]
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.logic'),
        colour: '#5C81A6',
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation_custom' },
          { kind: 'block', type: 'logic_negate' },
          { kind: 'block', type: 'logic_boolean' },
          { kind: 'block', type: 'logic_null' },
          { kind: 'block', type: 'logic_ternary' },
          { kind: 'block', type: 'logic_if_empty_custom' },
        ]
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.loops'),
        colour: '#5CA65C',
        contents: [
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'controls_whileUntil' },
          { kind: 'block', type: 'loops_do_while_custom' },
          { kind: 'block', type: 'controls_for' },
          { kind: 'block', type: 'controls_forEach' },
          { kind: 'block', type: 'object_for_each' },
          { kind: 'block', type: 'controls_flow_statements' },
        ]
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.math'),
        colour: '#5C68A6',
        contents: [
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_sum_custom' },
          { kind: 'block', type: 'math_multiply_custom' },
          { kind: 'block', type: 'math_subtract_custom' },
          { kind: 'block', type: 'math_divide_custom' },
          { kind: 'block', type: 'math_power_custom' },
          { kind: 'block', type: 'math_single' },
          { kind: 'block', type: 'math_number_property' },
          { kind: 'block', type: 'math_round' },
          { kind: 'block', type: 'math_modulo' },
          { kind: 'block', type: 'math_on_list' },

        ]
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.text'),
        colour: '#5CA68D',
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_join_custom' },
          { kind: 'block', type: 'text_check_custom' },
          { kind: 'block', type: 'text_append' },
          { kind: 'block', type: 'text_length' },
          { kind: 'block', type: 'text_isEmpty' },
          { kind: 'block', type: 'text_getSubstring' },
          { kind: 'block', type: 'text_changeCase' },
          { kind: 'block', type: 'text_trim' },
        ]
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.lists'),
        colour: '#745CA6',
        contents: [
          { kind: 'block', type: 'lists_create_with' },
          { kind: 'block', type: 'lists_length' },
          { kind: 'block', type: 'lists_isEmpty' },
          { kind: 'block', type: 'lists_indexOf' },
          { kind: 'block', type: 'lists_getIndex' },
          { kind: 'block', type: 'lists_setIndex' },
          { kind: 'block', type: 'lists_getSublist' },
          { kind: 'block', type: 'lists_sort' },
        ]
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.object'),
        colour: '#FFAB19',
        contents: [
          { kind: 'block', type: 'object_define' },
          { kind: 'block', type: 'object_assign' },
          { kind: 'block', type: 'object_set' },
          { kind: 'block', type: 'object_get' },
          { kind: 'block', type: 'object_delete' },
        ]
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.functions'),
        colour: '#9A5CA6',
        custom: 'PROCEDURE'
      },
      {
        kind: 'category',
        name: i18n.global.t('categories.other'),
        colour: '#000000',
        contents: [
          { kind: 'block', type: 'database_query' },
          { kind: 'block', type: 'api_request' },
          { kind: 'block', type: 'send_email' },
          { kind: 'block', type: 'file_operation' },
          { kind: 'block', type: 'validate_input' },
          { kind: 'block', type: 'log_custom' },
        ]
      },
      ...variableCategories,
    ]
  }
}
