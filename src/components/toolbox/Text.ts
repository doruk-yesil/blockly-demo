import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineTextBlocks = () => {
  Blockly.Blocks['text_check'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField(i18n.global.t('blocks.text_input_label')) // örn: "Metin"

      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18n.global.t('blocks.contains'), 'INCLUDES'],       // "içerir"
          [i18n.global.t('blocks.not_contains'), 'NOT_INCLUDES'] // "içermez"
        ]), 'OPERATOR')

      this.appendValueInput('SUBSTRING')
        .setCheck('String')
        .appendField(i18n.global.t('blocks.substring_label')) // örn: "şunu:"

      this.setInputsInline(true)
      this.setOutput(true, 'Boolean')
      this.setColour('#A1862D')
      this.setTooltip(i18n.global.t('blocks.text_check_tooltip')) // tooltip çevirisi
      this.setHelpUrl('')
    }
  }

  Blockly.Blocks['text_length'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck('String')
        .appendField(i18n.global.t('blocks.length_label')) // örn: "uzunluk"

      this.setOutput(true, 'Number')
      this.setColour('#A1862D')
      this.setTooltip(i18n.global.t('blocks.text_length_tooltip'))
      this.setHelpUrl('')
    }
  }
}
