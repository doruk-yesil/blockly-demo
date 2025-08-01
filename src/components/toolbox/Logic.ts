import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineLogicBlocks = () => {
  Blockly.Blocks['logic_operation_custom'] = {
    init: function () {
      this.setHelpUrl('')
      this.setColour('#5B80A5')
      this.setTooltip(i18n.global.t('blocks.logic_operation_tooltip'))
      this.itemCount_ = 2
      this.setOutput(true, 'Boolean')
      this.updateShape_()
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

    updateShape_: function () {
      let i = 0
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i)
        i++
      }
      if (this.getInput('ADD_BTN')) this.removeInput('ADD_BTN')
      const minusIcon = 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#f0f0f0"/>
        <path fill="#505050" d="M19,13H5V11H19V13Z" />
      </svg>`)
      const plusIcon = 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#f0f0f0"/>
        <path fill="#505050" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
      </svg>`)
      for (let i = 0; i < this.itemCount_; i++) {
        const input = this.appendValueInput('ADD' + i).setCheck('Boolean')
        if (i !== 0) {
          input.appendField(new Blockly.FieldDropdown([
            [i18n.global.t('blocks.logic_operation_and'), 'AND'],
            [i18n.global.t('blocks.logic_operation_or'), 'OR']
          ]), 'OPERATOR')
        }
        if (this.itemCount_ > 2) {
          input.appendField(new Blockly.FieldImage(minusIcon, 15, 15, '-', () => {
            this.itemCount_--
            this.updateShape_()
          }))
        }
      }
      this.appendDummyInput('ADD_BTN')
        .appendField(new Blockly.FieldImage(plusIcon, 15, 15, '+', () => {
          this.itemCount_++
          this.updateShape_()
        }))
    }
  }
}