import * as Blockly from 'blockly'
import { i18n } from '../../i18n'

export const defineOtherBlocks = () => {
  Blockly.Blocks['database_query'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Query database")
        .appendField(new Blockly.FieldDropdown([
          ["SELECT", "SELECT"],
          ["INSERT", "INSERT"],
          ["UPDATE", "UPDATE"],
          ["DELETE", "DELETE"]
        ]), "OPERATION")
      this.appendValueInput("TABLE")
        .setCheck("String")
        .appendField("table")
      this.appendValueInput("CONDITIONS")
        .setCheck("String")
        .appendField("where")
      this.setOutput(true, "Array")
      this.setColour('#000000')
      this.setTooltip("Execute database operations")
    }
  }
  Blockly.Blocks['api_request'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("API")
        .appendField(new Blockly.FieldDropdown([
          ["GET", "GET"],
          ["POST", "POST"],
          ["PUT", "PUT"],
          ["DELETE", "DELETE"]
        ]), "METHOD")
      this.appendValueInput("URL")
        .setCheck("String")
        .appendField("to")
      this.appendValueInput("HEADERS")
        .setCheck("String")
        .appendField("headers")
      this.appendValueInput("BODY")
        .setCheck("String")
        .appendField("body")
      this.setOutput(true, "String")
      this.setColour('#000000')
      this.setTooltip("Make HTTP API requests")
    }
  }
  Blockly.Blocks['send_email'] = {
    init: function () {
      this.appendValueInput("TO")
        .setCheck("String")
        .appendField("Send email to")
      this.appendValueInput("SUBJECT")
        .setCheck("String")
        .appendField("subject")
      this.appendValueInput("BODY")
        .setCheck("String")
        .appendField("message")
      this.appendDummyInput()
        .appendField("priority")
        .appendField(new Blockly.FieldDropdown([
          ["low", "LOW"],
          ["normal", "NORMAL"],
          ["high", "HIGH"],
          ["urgent", "URGENT"]
        ]), "PRIORITY")
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#000000')
      this.setTooltip("Send email notifications")
    }
  }
  Blockly.Blocks['file_operation'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["Read file", "READ"],
          ["Write file", "WRITE"],
          ["Delete file", "DELETE"],
          ["Create folder", "MKDIR"]
        ]), "OPERATION")
      this.appendValueInput("PATH")
        .setCheck("String")
        .appendField("path")
      this.appendValueInput("CONTENT")
        .setCheck("String")
        .appendField("content")
      this.setOutput(true, "String")
      this.setColour('#000000')
      this.setTooltip("File system operations")
    }
  }
  Blockly.Blocks['validate_input'] = {
    init: function () {
      this.appendValueInput("INPUT")
        .setCheck("String")
        .appendField("Validate")
      this.appendDummyInput()
        .appendField("as")
        .appendField(new Blockly.FieldDropdown([
          ["email", "EMAIL"],
          ["phone", "PHONE"],
          ["credit card", "CREDIT_CARD"],
          ["URL", "URL"],
          ["IP address", "IP"],
          ["date", "DATE"]
        ]), "TYPE")
      this.setOutput(true, "Boolean")
      this.setColour('#000000')
      this.setTooltip("Validate input formats")
    }
  }
  Blockly.Blocks['log_custom'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .appendField(i18n.global.t('blocks.log'))
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#000000')
    }
  }
}