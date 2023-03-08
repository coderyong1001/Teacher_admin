import str from './style'

function editorHtml(data, bgImg) {
  data = data.replace(/(①|②|③|④|⑤|{{)/gi, function (matchStr, p) {
    return {
      '①': '{{q1}}',
      '②': '{{q2}}',
      '③': '{{q3}}',
      '④': '{{q4}}',
      '⑤': '{{q5}}',
      '{{': `{{'{{'}}`,
    }[p] //
  })
  var htmlStart = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    ${str}
    <style>
      hr {
        margin: 14px 0;
      }
    </style>
  </head>
  <body style=" margin: 0;">
    <div style=" width: 780px; height: 546px; padding: 42px 60px; overflow: hidden; background-image: url(${bgImg}); background-size: 100% 100%; background-repeat: no-repeat; ">`

  var htmlEnd = `</div><script>
  console.log(document.getElementsByTagName('p').length)
  let pList = document.getElementsByTagName('p')
  let len = pList.length
  for (let index = 0; index < len; index++) {
    if (pList[index].innerHTML === '') {
      pList[index].style.height = '21px'
    }
  }
</script>
  </body>
</html>`

  const file = `${htmlStart}${data}${htmlEnd}`
  return file
}
export default editorHtml
