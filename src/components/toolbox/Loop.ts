import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineLoopBlocks = () => {
  Blockly.Blocks['loops_do_while'] = {
    init: function () {
      this.appendStatementInput('DO')
        .appendField(i18n.global.t('blocks.do'))
      this.appendValueInput('WHILE')
        .setCheck('Boolean')
        .appendField(i18n.global.t('blocks.while'))
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#5CA65C')
    }
  }
  Blockly.Blocks['object_for_each'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldVariable('obj'), 'OBJ')
        .appendField(i18n.global.t('blocks.object_for_each'))
        .appendField(new Blockly.FieldVariable('key'), 'KEY')
        .appendField('-')
        .appendField(new Blockly.FieldVariable('value'), 'VALUE')
      this.appendStatementInput('DO')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#5CA65C')
    }
  }
}