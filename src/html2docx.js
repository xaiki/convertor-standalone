const { Document, Packer, Paragraph, TextRun } = require('docx');

const textAlign2style = {
  'justify': 'justified',
  'center': 'center',
  'left': 'left',
  'right': 'right',
}

const nodeName2style = {
  'B': 'bold',
  'U': 'underline',
  'I': 'italics'
}

const css2style = (element) => {
  const css = element.style
  const style = {}
  if (element.nodeName.match(/H.?/)) {
    style[nodeName.replace('H', 'heading')] = true;
  }

  const ns = nodeName2style[element.nodeName]
  if (ns) style[ns] = true
  
  if (!css) return style;

  Object.keys(css).forEach(i => {
    const k = css[i];
    
    switch (k) {
      case "text-indent": style['indent'] = css[k]; break;
      case "text-align": style[textAlign2style[css[k]]] = true; break;
      case "color": style[k] = css[k].replace('#', ''); break;
    }    
  })
  
  return style
}

const html2doc = (html) => {
  const domparser = new DOMParser()
  const dom = domparser.parseFromString(html, 'text/html')
  const doc = new Document()
  
  function childToJSON(dom, styles, level = 0) {
    let children = []
    
    console.error(dom.nodeName, styles)
    dom.childNodes.forEach(element => {
      if(element.nodeType === Node.TEXT_NODE && level) {
        children.push(new TextRun({text: element.data, ...styles, ...css2style(element)}))
      }
      
      else if(element.nodeType === Node.ELEMENT_NODE) {
        const subchildren = childToJSON(
          element,
          Object.assign({}, styles, css2style(element)),
          level + 1)
        switch (level) {
          case 0: children.push(new Paragraph({
            properties: styles,
            children: subchildren,
          })); break
          default: children = children.concat(subchildren); break
        }
      }  
    })
    
    return children
  }

  const children = childToJSON(dom.body)
  doc.addSection({
    properties: {},
    children
  })
  return doc
}


const create = html => {
  const doc = html2doc(html)
  return Packer.toBuffer(doc)
}

module.exports = {create}
