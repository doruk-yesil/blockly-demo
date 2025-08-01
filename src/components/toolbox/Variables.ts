import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineVariablesBlocks = () => {
  Blockly.Blocks['variable_define_custom'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .appendField(i18n.global.t('blocks.variable_define'))
        .appendField(new Blockly.FieldVariable('var'), 'VAR')
        .appendField('=')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#FF6B35')
    }
  }
  Blockly.Blocks['constant_custom'] = {
    init: function () {
      this.typeDropdown = new Blockly.FieldDropdown([
        ['sayı', 'NUMBER'],
        ['metin', 'TEXT'],
        ['boolean', 'BOOLEAN']
      ], this.onTypeChange.bind(this));
      this.appendDummyInput('INPUT')
        .appendField('Sabit')
        .appendField(this.typeDropdown, 'TYPE');
      this.getInput('INPUT').appendField(new Blockly.FieldNumber(0), 'VALUE');
      this.setOutput(true);
      this.setColour('#FF6B35');
    },
    onTypeChange: function (newType: string) {
      const input = this.getInput('INPUT');
      if (!input) return newType;
      if (input.fieldRow.find((field: any) => field.name === 'VALUE')) {
        input.removeField('VALUE');
      }
      if (newType === 'NUMBER') {
        input.appendField(new Blockly.FieldNumber(0), 'VALUE');
      } else if (newType === 'TEXT') {
        input.appendField(new Blockly.FieldTextInput(''), 'VALUE');
      } else if (newType === 'BOOLEAN') {
        input.appendField(new Blockly.FieldDropdown([
          ['true', 'TRUE'],
          ['false', 'FALSE'],
          ['null', 'NULL']
        ]), 'VALUE');
      }
      return newType;
    }
  }
  Blockly.Blocks['variable_custom'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldVariable('var'), 'VAR')
      this.setOutput(true)
      this.setColour('#FF6B35')
    }
  }
  Blockly.Blocks['variable_set_custom'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .appendField(new Blockly.FieldVariable('var'), 'VAR')
        .appendField('=')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#FF6B35')
    }
  }
  Blockly.Blocks['variable_typeof_custom'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(i18n.global.t('blocks.variable_typeof'))
        .appendField(new Blockly.FieldVariable('var'), 'VAR')
      this.setOutput(true)
      this.setColour('#FF6B35')
    }
  }
}