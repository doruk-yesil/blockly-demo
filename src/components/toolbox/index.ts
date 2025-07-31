export const getBlocklyLocale = async (langCode: string) => {
  switch (langCode) {
    case 'tr':
      return await import('blockly/msg/tr')
    case 'ar':
      return await import('blockly/msg/ar')
    case 'de':
      return await import('blockly/msg/de')
    case 'en':
    default:
      return await import('blockly/msg/en')
  }
}

import { i18n } from '../../i18n'
import { defineLogicBlocks } from './Logic'
import { defineMathBlocks } from './Math'
import { defineTextBlocks } from './Text'
import { defineCustomBlocks } from './Custom'

defineLogicBlocks()
defineMathBlocks()
defineTextBlocks()
defineCustomBlocks()

export const getToolbox = () => ({
  kind: 'categoryToolbox',
  contents: [
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
      ]
    },
    {
      kind: 'category',
      name: i18n.global.t('categories.loops'),
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
      name: i18n.global.t('categories.variables'),
      colour: '#A65C81',
      custom: 'VARIABLE'
    },
    {
      kind: 'category',
      name: i18n.global.t('categories.functions'),
      colour: '#9A5CA6',
      custom: 'PROCEDURE'
    },
    {
      kind: 'category',
      name: i18n.global.t('categories.custom'),
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
})
