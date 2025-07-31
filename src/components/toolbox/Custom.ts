import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import { phpGenerator } from 'blockly/php'

export const defineCustomBlocks = () => {
  // 1. Database Query Block
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
      this.setColour('#2196F3')
      this.setTooltip("Execute database operations")
    }
  }

  // 2. API Request Block
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
      this.setColour('#FF9800')
      this.setTooltip("Make HTTP API requests")
    }
  }

  // 3. Email Notification Block
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
      this.setColour('#4CAF50')
      this.setTooltip("Send email notifications")
    }
  }

  // 4. File System Block
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
      this.setColour('#9C27B0')
      this.setTooltip("File system operations")
    }
  }

  // 5. Validation Block
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
      this.setColour('#FF5722')
      this.setTooltip("Validate input formats")
    }
  }

  // Code generators for database query
  javascriptGenerator.forBlock['database_query'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const table = generator.valueToCode(block, 'TABLE', generator.ORDER_ATOMIC || 0) || '""'
    const conditions = generator.valueToCode(block, 'CONDITIONS', generator.ORDER_ATOMIC || 0) || '""'
    const code = `db.${operation.toLowerCase()}(${table}, ${conditions})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['database_query'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const table = generator.valueToCode(block, 'TABLE', generator.ORDER_ATOMIC || 0) || '""'
    const conditions = generator.valueToCode(block, 'CONDITIONS', generator.ORDER_ATOMIC || 0) || '""'
    const code = `db.${operation.toLowerCase()}(${table}, ${conditions})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['database_query'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const table = generator.valueToCode(block, 'TABLE', generator.ORDER_ATOMIC || 0) || '""'
    const conditions = generator.valueToCode(block, 'CONDITIONS', generator.ORDER_ATOMIC || 0) || '""'
    const code = `$db->${operation.toLowerCase()}(${table}, ${conditions})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  // Code generators for API request
  javascriptGenerator.forBlock['api_request'] = function (block: any, generator: any) {
    const method = block.getFieldValue('METHOD')
    const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC || 0) || '""'
    const headers = generator.valueToCode(block, 'HEADERS', generator.ORDER_ATOMIC || 0) || '{}'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || 'null'
    const code = `fetch(${url}, {method: '${method}', headers: ${headers}, body: ${body}})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['api_request'] = function (block: any, generator: any) {
    const method = block.getFieldValue('METHOD')
    const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC || 0) || '""'
    const headers = generator.valueToCode(block, 'HEADERS', generator.ORDER_ATOMIC || 0) || '{}'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || 'None'
    const code = `requests.${method.toLowerCase()}(${url}, headers=${headers}, data=${body})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['api_request'] = function (block: any, generator: any) {
    const method = block.getFieldValue('METHOD')
    const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC || 0) || '""'
    const headers = generator.valueToCode(block, 'HEADERS', generator.ORDER_ATOMIC || 0) || 'array()'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || 'null'
    const code = `curl_request('${method}', ${url}, ${headers}, ${body})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  // Code generators for email
  javascriptGenerator.forBlock['send_email'] = function (block: any, generator: any) {
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ATOMIC || 0) || '""'
    const subject = generator.valueToCode(block, 'SUBJECT', generator.ORDER_ATOMIC || 0) || '""'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || '""'
    const priority = block.getFieldValue('PRIORITY')
    const code = `emailService.send({to: ${to}, subject: ${subject}, body: ${body}, priority: '${priority}'})\n`
    return code
  }

  pythonGenerator.forBlock['send_email'] = function (block: any, generator: any) {
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ATOMIC || 0) || '""'
    const subject = generator.valueToCode(block, 'SUBJECT', generator.ORDER_ATOMIC || 0) || '""'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || '""'
    const priority = block.getFieldValue('PRIORITY')
    const code = `send_email(to=${to}, subject=${subject}, body=${body}, priority='${priority}')\n`
    return code
  }

  phpGenerator.forBlock['send_email'] = function (block: any, generator: any) {
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ATOMIC || 0) || '""'
    const subject = generator.valueToCode(block, 'SUBJECT', generator.ORDER_ATOMIC || 0) || '""'
    const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC || 0) || '""'
    const priority = block.getFieldValue('PRIORITY')
    const code = `mail(${to}, ${subject}, ${body}, ['Priority' => '${priority}'])\n`
    return code
  }

  // Code generators for file operations
  javascriptGenerator.forBlock['file_operation'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC || 0) || '""'
    const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC || 0) || '""'
    let code = ''
    switch (operation) {
      case 'READ': code = `fs.readFileSync(${path}, 'utf8')`; break
      case 'write': code = `fs.writeFileSync(${path}, ${content})`; break
      case 'delete': code = `fs.unlinkSync(${path})`; break
      case 'mkdir': code = `fs.mkdirSync(${path})`; break
    }
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['file_operation'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC || 0) || '""'
    const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC || 0) || '""'
    let code = ''
    switch (operation) {
      case 'read': code = `open(${path}, 'r').read()`; break
      case 'write': code = `open(${path}, 'w').write(${content})`; break
      case 'delete': code = `os.remove(${path})`; break
      case 'mkdir': code = `os.makedirs(${path})`; break
    }
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['file_operation'] = function (block: any, generator: any) {
    const operation = block.getFieldValue('OPERATION')
    const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC || 0) || '""'
    const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC || 0) || '""'
    let code = ''
    switch (operation) {
      case 'read': code = `file_get_contents(${path})`; break
      case 'write': code = `file_put_contents(${path}, ${content})`; break
      case 'delete': code = `unlink(${path})`; break
      case 'mkdir': code = `mkdir(${path})`; break
    }
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  javascriptGenerator.forBlock['validate_input'] = function (block: any, generator: any) {
    const input = generator.valueToCode(block, 'INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const type = block.getFieldValue('TYPE')

    const code = `validator.is${type.toLowerCase().replace('_', '')}(${input})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  pythonGenerator.forBlock['validate_input'] = function (block: any, generator: any) {
    const input = generator.valueToCode(block, 'INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const type = block.getFieldValue('TYPE')

    const code = `validate_${type.toLowerCase()}(${input})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }

  phpGenerator.forBlock['validate_input'] = function (block: any, generator: any) {
    const input = generator.valueToCode(block, 'INPUT', generator.ORDER_ATOMIC || 0) || '""'
    const type = block.getFieldValue('TYPE')

    const code = `filter_var(${input}, FILTER_VALIDATE_${type})`
    return [code, generator.ORDER_FUNCTION_CALL || 0]
  }
}