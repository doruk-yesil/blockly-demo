import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineTextBlocks = () => {
  Blockly.Blocks['text_join_custom'] = {
    init: function () {
      this.setHelpUrl('')
      this.setColour('#5CA68D')
      this.setTooltip(i18n.global.t('blocks.text_join_tooltip'))
      this.itemCount_ = 2
      this.updateShape_()
      this.setOutput(true, 'String')
    },

    mutationToDom: function () {
      const container = document.createElement('mutation')
      container.setAttribute('items', this.itemCount_)
      return container
    },

    domToMutation: function (xmlElement: any) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10)
      this.updateShape_()
    },

    updateShape_: function (this: any) {
      let i = 0
      while (this.getInput('ADD' + i) || this.getInput('SEP' + i)) {
        if (this.getInput('ADD' + i)) this.removeInput('ADD' + i)
        if (this.getInput('SEP' + i)) this.removeInput('SEP' + i)
        i++
      }
      if (this.getInput('ADD_BTN')) this.removeInput('ADD_BTN')
      const minusIcon = 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#f0f0f0"/>
      <path fill="#505050" d="M19,13H5V11H19V13Z" />
    </svg>`)
      for (let i = 0; i < this.itemCount_; i++) {
        const input = this.appendValueInput('ADD' + i).setCheck('String')

        if (i === 0) {
          input.appendField(i18n.global.t('blocks.text_join_title'))
        } else {
          input.appendField('&')
        }
        if (this.itemCount_ > 2) {
          input.appendField(new Blockly.FieldImage(minusIcon, 15, 15, '-', () => {
            this.itemCount_--
            this.updateShape_()
          }))
        }
      }
      const plusIcon = 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#f0f0f0"/>
      <path fill="#505050" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
    </svg>`)
      this.appendDummyInput('ADD_BTN')
        .appendField(new Blockly.FieldImage(plusIcon, 15, 15, '+', () => {
          this.itemCount_++
          this.updateShape_()
        }))
    }
  }
  Blockly.Blocks['text_check_custom'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField(i18n.global.t('blocks.text_input_label'))
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18n.global.t('blocks.contains'), 'INCLUDES'],
          [i18n.global.t('blocks.not_contains'), 'NOT_INCLUDES']
        ]), 'OPERATOR')
      this.appendValueInput('SUBSTRING')
        .setCheck('String')
        .appendField(i18n.global.t('blocks.substring_label'))
      this.setInputsInline(true)
      this.setOutput(true, 'Boolean')
      this.setColour('#5CA68D')
      this.setTooltip(i18n.global.t('blocks.text_check_tooltip'))
      this.setHelpUrl('')
    }
  }
}
