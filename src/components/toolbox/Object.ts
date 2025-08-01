import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineObjectBlocks = () => {
  Blockly.Blocks['object_define'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(i18n.global.t('blocks.object_define'))
        .appendField(new Blockly.FieldVariable('obj'), 'VAR')
        .appendField("=");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FFAB19');
    }
  };
  Blockly.Blocks['object_assign'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .appendField(i18n.global.t('blocks.object_assign'))
        .appendField(new Blockly.FieldVariable('obj'), 'VAR')
        .appendField("=");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FFAB19');
    }
  };
  Blockly.Blocks['object_set'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .appendField(i18n.global.t('blocks.object_set'))
        .appendField(new Blockly.FieldVariable('obj'), 'VAR')
        .appendField(".")
        .appendField(new Blockly.FieldTextInput('key'), 'KEY')
        .appendField("=");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FFAB19');
    }
  };
  Blockly.Blocks['object_get'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(i18n.global.t('blocks.object_get'))
        .appendField(new Blockly.FieldVariable('obj'), 'VAR')
        .appendField(".")
        .appendField(new Blockly.FieldTextInput('key'), 'KEY');
      this.setOutput(true);
      this.setColour('#FFAB19');
    }
  };
  Blockly.Blocks['object_delete'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(i18n.global.t('blocks.object_delete'))
        .appendField(new Blockly.FieldVariable('obj'), 'VAR')
        .appendField(".")
        .appendField(new Blockly.FieldTextInput('key'), 'KEY');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FFAB19');
    }
  };
}
