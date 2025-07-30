import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineMathBlocks = () => {
  Blockly.Blocks['math_sum_custom'] = {
    init: function (this: any) {
      this.itemCount_ = 2
      this.setHelpUrl('')
      this.setOutput(true, 'Number')
      this.setColour('#5C68A6')
      this.setTooltip('Sayıları toplar. Artı simgesine tıklayarak giriş ekleyebilirsin.')
      this.updateShape_()
    },

    mutationToDom: function (this: any) {
      const container = document.createElement('mutation')
      container.setAttribute('items', this.itemCount_)
      return container
    },

    domToMutation: function (this: any, xmlElement: any) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10)
      this.updateShape_()
    },

    addInput_: function (this: any) {
      this.itemCount_++
      this.updateShape_()
    },

    removeInput_: function (this: any, index: number) {
      if (this.itemCount_ <= 2) return
      const targetInput = this.getInput('ADD' + index)
      if (targetInput?.connection?.targetConnection) {
        targetInput.connection.targetConnection.getSourceBlock().unplug()
      }
      this.itemCount_--
      this.updateShape_()
    },

    updateShape_: function (this: any) {
      let i = 0
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i)
        i++
      }
      if (this.getInput('ADD_BTN')) {
        this.removeInput('ADD_BTN')
      }
      for (let i = 0; i < this.itemCount_; i++) {
        const input = this.appendValueInput('ADD' + i).setCheck('Number')
        input.appendField(i === 0 ? 'Topla:' : '+')
        if (this.itemCount_ > 2) {
          const minusIcon = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#f0f0f0"/><path fill="rgb(80,80,80)" d="M19,13H5V11H19V13Z" /></svg>')
          input.appendField(new Blockly.FieldImage(minusIcon, 15, 15, '-', () => this.removeInput_(i)))
        }
      }
      const plusIcon = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#f0f0f0"/><path fill="rgb(80,80,80)" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>')
      this.appendDummyInput('ADD_BTN').appendField(new Blockly.FieldImage(plusIcon, 15, 15, '+', () => this.addInput_()))
    }
  }
  Blockly.Blocks['math_multiply_custom'] = {
    init: function (this: any) {
      this.itemCount_ = 2
      this.setHelpUrl('')
      this.setOutput(true, 'Number')
      this.setColour('#5C68A6')
      this.setTooltip(i18n.global.t('blocks.math_multiply_tooltip'))
      this.updateShape_()
    },

    mutationToDom: function (this: any) {
      const container = document.createElement('mutation')
      container.setAttribute('items', this.itemCount_)
      return container
    },

    domToMutation: function (this: any, xmlElement: any) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10)
      this.updateShape_()
    },

    addInput_: function (this: any) {
      this.itemCount_++
      this.updateShape_()
    },

    removeInput_: function (this: any, index: number) {
      if (this.itemCount_ <= 2) return
      const targetInput = this.getInput('ADD' + index)
      if (targetInput?.connection?.targetConnection) {
        targetInput.connection.targetConnection.getSourceBlock().unplug()
      }
      this.itemCount_--
      this.updateShape_()
    },

    updateShape_: function (this: any) {
      let i = 0
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i)
        i++
      }
      if (this.getInput('ADD_BTN')) {
        this.removeInput('ADD_BTN')
      }
      for (let i = 0; i < this.itemCount_; i++) {
        const input = this.appendValueInput('ADD' + i).setCheck('Number')
        input.appendField(i === 0 ? i18n.global.t('blocks.math_multiply_label') : '×')
        if (this.itemCount_ > 2) {
          const minusIcon = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#f0f0f0"/><path fill="rgb(80,80,80)" d="M19,13H5V11H19V13Z" /></svg>')
          input.appendField(new Blockly.FieldImage(minusIcon, 15, 15, '-', () => this.removeInput_(i)))
        }
      }
      const plusIcon = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#f0f0f0"/><path fill="rgb(80,80,80)" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>')
      this.appendDummyInput('ADD_BTN').appendField(new Blockly.FieldImage(plusIcon, 15, 15, '+', () => this.addInput_()))
    }
  }
  Blockly.Blocks['math_subtract_custom'] = {
    init: function (this: any) {
      this.setHelpUrl('')
      this.setOutput(true, 'Number')
      this.setColour('#5C68A6')
      this.setTooltip('İki sayıyı birbirinden çıkarır.')
      this.appendValueInput('A').setCheck('Number')
      this.appendDummyInput().appendField('-')
      this.appendValueInput('B').setCheck('Number')
    }
  }
  Blockly.Blocks['math_divide_custom'] = {
    init: function (this: any) {
      this.setHelpUrl('')
      this.setOutput(true, 'Number')
      this.setColour('#5C68A6')
      this.setTooltip('İlk sayıyı ikinci sayıya böler.')
      this.appendValueInput('A').setCheck('Number')
      this.appendDummyInput().appendField('÷')
      this.appendValueInput('B').setCheck('Number')
    }
  }

}