const str = `<style>
p {
  margin: 0;
  white-space: pre;
  white-space: break-spaces;
}
.braft-output-content p{min-height:1em}.braft-output-content .image-wrap
img{max-width:100%;height:auto}.braft-output-content ul,.braft-output-content ol{margin:16px
0;padding:0}.braft-output-content blockquote{margin:0 0 10px 0;padding:15px
20px;background-color:#f1f2f3;border-left:solid 5px
#ccc;color:#666;font-style:italic}.braft-output-content
pre{max-width:100%;max-height:100%;margin:10px
0;padding:15px;overflow:auto;background-color:#f1f2f3;border-radius:3px;color:#666;font-family:monospace;font-size:14px;font-weight:normal;line-height:16px;word-wrap:break-word;white-space:pre-wrap}.braft-output-content
pre pre{margin:0;padding:0}

.DraftEditor-editorContainer,.DraftEditor-root,.public-DraftEditor-content{height:inherit;text-align:initial}.public-DraftEditor-content[contenteditable=true]{-webkit-user-modify:read-write-plaintext-only}.DraftEditor-root{position:relative}.DraftEditor-editorContainer{background-color:hsla(0,0%,100%,0);border-left:.1px
  solid
  transparent;position:relative;z-index:1}.public-DraftEditor-block{position:relative}.DraftEditor-alignLeft
  .public-DraftStyleDefault-block{text-align:left}.DraftEditor-alignLeft
  .public-DraftEditorPlaceholder-root{left:0;text-align:left}.DraftEditor-alignCenter
  .public-DraftStyleDefault-block{text-align:center}.DraftEditor-alignCenter
  .public-DraftEditorPlaceholder-root{margin:0
  auto;text-align:center;width:100%}.DraftEditor-alignRight
  .public-DraftStyleDefault-block{text-align:right}.DraftEditor-alignRight
  .public-DraftEditorPlaceholder-root{right:0;text-align:right}.public-DraftEditorPlaceholder-root{color:#9197a3;position:absolute;z-index:1}.public-DraftEditorPlaceholder-hasFocus{color:#bdc1c9}.DraftEditorPlaceholder-hidden{display:none}.public-DraftStyleDefault-block{position:relative;white-space:pre-wrap}.public-DraftStyleDefault-ltr{direction:ltr;text-align:left}.public-DraftStyleDefault-rtl{direction:rtl;text-align:right}.public-DraftStyleDefault-listLTR{direction:ltr}.public-DraftStyleDefault-listRTL{direction:rtl}.public-DraftStyleDefault-ol,.public-DraftStyleDefault-ul{margin:16px
  0;padding:0}.public-DraftStyleDefault-depth0.public-DraftStyleDefault-listLTR{margin-left:1.5em}.public-DraftStyleDefault-depth0.public-DraftStyleDefault-listRTL{margin-right:1.5em}.public-DraftStyleDefault-depth1.public-DraftStyleDefault-listLTR{margin-left:3em}.public-DraftStyleDefault-depth1.public-DraftStyleDefault-listRTL{margin-right:3em}.public-DraftStyleDefault-depth2.public-DraftStyleDefault-listLTR{margin-left:4.5em}.public-DraftStyleDefault-depth2.public-DraftStyleDefault-listRTL{margin-right:4.5em}.public-DraftStyleDefault-depth3.public-DraftStyleDefault-listLTR{margin-left:6em}.public-DraftStyleDefault-depth3.public-DraftStyleDefault-listRTL{margin-right:6em}.public-DraftStyleDefault-depth4.public-DraftStyleDefault-listLTR{margin-left:7.5em}.public-DraftStyleDefault-depth4.public-DraftStyleDefault-listRTL{margin-right:7.5em}.public-DraftStyleDefault-unorderedListItem{list-style-type:square;position:relative}.public-DraftStyleDefault-unorderedListItem.public-DraftStyleDefault-depth0{list-style-type:disc}.public-DraftStyleDefault-unorderedListItem.public-DraftStyleDefault-depth1{list-style-type:circle}.public-DraftStyleDefault-orderedListItem{list-style-type:none;position:relative}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listLTR:before{left:-36px;position:absolute;text-align:right;width:30px}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listRTL:before{position:absolute;right:-36px;text-align:left;width:30px}.public-DraftStyleDefault-orderedListItem:before{content:counter(a)
  ".
  ";counter-increment:a}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth1:before{content:counter(b)
  ".
  ";counter-increment:b}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth2:before{content:counter(c)
  ".
  ";counter-increment:c}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth3:before{content:counter(d)
  ".
  ";counter-increment:d}.public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth4:before{content:counter(e)
  ".
  ";counter-increment:e}.public-DraftStyleDefault-depth0.public-DraftStyleDefault-reset{counter-reset:a}.public-DraftStyleDefault-depth1.public-DraftStyleDefault-reset{counter-reset:b}.public-DraftStyleDefault-depth2.public-DraftStyleDefault-reset{counter-reset:c}.public-DraftStyleDefault-depth3.public-DraftStyleDefault-reset{counter-reset:d}.public-DraftStyleDefault-depth4.public-DraftStyleDefault-reset{counter-reset:e}.bf-switch{position:relative;width:32px;height:16px;background-color:hsla(0,0%,100%,.15);border-radius:8px;transition:background
  .3s}.bf-switch.active{background-color:#3498db}.bf-switch.active:before{left:16px}.bf-switch:before{position:absolute;left:0;display:block;width:16px;height:16px;border-radius:8px;background-color:#eee;content:"";transform:scale(1.2);transition:.3s}.bf-image-link-editor,.bf-image-size-editor{padding-bottom:1px;overflow:hidden;border-radius:2px
  2px 0 0;box-shadow:inset 0 -1px 0 0 hsla(0,0%,100%,.1)}.bf-image-link-editor
  .editor-input-group,.bf-image-size-editor .editor-input-group{width:300px;margin:8px
  10px;overflow:hidden}.bf-image-link-editor input,.bf-image-size-editor
  input{display:block;float:left;box-sizing:content-box;height:32px;margin:0 5px 0 0;padding:0
  10px;background-color:hsla(0,0%,100%,.1);border:none;border-radius:2px;outline:none;box-shadow:inset
  0 0 0 1px hsla(0,0%,100%,.1);color:#fff;font-weight:700}.bf-image-link-editor
  input:hover,.bf-image-size-editor input:hover{box-shadow:inset 0 0 0 1px
  rgba(52,152,219,.5)}.bf-image-link-editor input:focus,.bf-image-size-editor
  input:focus{box-shadow:inset 0 0 0 1px #3498db}.bf-image-link-editor button,.bf-image-size-editor
  button{float:left;width:90px;height:32px;margin:0;padding:0
  20px;background-color:#3498db;border:none;color:#fff;font-size:12px;border-radius:2px;cursor:pointer}.bf-image-link-editor
  button:hover,.bf-image-size-editor button:hover{background-color:#2084c7}.bf-image-size-editor
  input{width:80px}.bf-image-link-editor input{width:185px}.bf-image-link-editor
  .switch-group{height:16px;margin:10px}.bf-image-link-editor .switch-group
  .bf-switch{float:left}.bf-image-link-editor .switch-group
  label{float:left;margin-left:15px;color:#999;font-size:12px;line-height:16px}.bf-content
  .bf-image{position:relative}.bf-content .bf-image
  .bf-csize-icon{position:absolute;z-index:2;width:10px;height:10px;background-color:rgba(52,152,219,.3)}.bf-content
  .bf-image .bf-csize-icon.right-bottom{right:0;bottom:0;cursor:se-resize}.bf-content .bf-image
  .bf-csize-icon.left-bottom{left:0;bottom:0;cursor:sw-resize}.bf-content .bf-image
  .bf-pre-csize{position:absolute;z-index:1;background:transparent}.bf-content .bf-image
  .bf-pre-csize.rightbottom{left:0;top:0;border:1px dashed #00bfff}.bf-content .bf-image
  .bf-pre-csize.leftbottom{right:0;top:0;border:1px dashed #00bfff}.bf-content .bf-image
  .bf-media-toolbar:before{visibility:hidden}.bf-content .bf-image
  .bf-media-toolbar[data-align=center] [data-align=center],.bf-content .bf-image
  .bf-media-toolbar[data-align=left] [data-align=left],.bf-content .bf-image
  .bf-media-toolbar[data-align=right] [data-align=right],.bf-content .bf-image
  .bf-media-toolbar[data-float=left] [data-float=left],.bf-content .bf-image
  .bf-media-toolbar[data-float=right]
  [data-float=right]{color:#3498db}.bf-player-holder{position:relative;height:240px;overflow:hidden;background-color:#21242a;border-radius:3px}.bf-player-holder
  .icon-badge{position:absolute;z-index:2;top:0;left:0;height:30px;padding:0 15px;border-radius:0 0
  3px 0;color:#fff;background-color:hsla(0,0%,100%,.1)}.bf-player-holder .icon-badge
  i,.bf-player-holder .icon-badge span{display:block;float:left;line-height:30px}.bf-player-holder
  .icon-badge span{margin-left:5px;font-size:12px}.bf-player-holder
  .button-remove{position:absolute;z-index:2;top:5px;right:5px;width:40px;height:40px;background-color:transparent;border:none;border-radius:50%;outline:none;color:#fff;font-size:24px;text-align:center;cursor:pointer}.bf-player-holder
  .button-remove:hover{color:#e74c3c}.bf-player-holder
  .button-play{position:relative;z-index:2;display:block;width:80px;height:80px;margin:40px auto
  20px;background-color:rgba(0,0,0,.7);border:none;border-radius:50%;outline:none;color:#fff;font-size:48px;line-height:80px;text-align:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);cursor:pointer}.bf-player-holder
  .button-play:hover{background-color:#3498db}.bf-player-holder
  .bf-name{position:relative;z-index:2;margin:0;color:#fff;font-size:14px;font-weight:500;text-align:center}.bf-player-holder
  .bf-url{position:relative;z-index:2;width:70%;margin:10px
  auto;color:hsla(0,0%,100%,.5);font-size:12px;font-weight:400;text-align:center}.bf-player-holder
  .bf-poster{position:absolute;top:0;left:0;width:100%;height:100%;background-repeat:no-repeat;background-position:50%
  50%;background-size:cover;opacity:.3}.bf-modal{position:fixed;z-index:99999;top:0;left:0;width:100%;height:100%}.bf-modal
  button{outline:none}.bf-modal-mask{position:absolute;z-index:1;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.1);opacity:0;transition:opacity
  .2s}.bf-modal-content{position:absolute;z-index:2;top:45%;left:50%;max-width:95%;background-color:#fff;border-radius:2px;box-shadow:0
  15px 30px rgba(0,0,0,.1);opacity:0;transform:translate(-50%,-40%);transition:transform .2s,opacity
  .2s}.bf-modal-header{height:50px}.bf-modal-caption{float:left;margin:0;padding:0
  15px;color:#999;font-size:14px;font-weight:400;line-height:50px}.bf-modal-close-button{float:right;width:50px;height:50px;background-color:transparent;border:none;color:#ccc;font-size:18px;cursor:pointer}.bf-modal-close-button:hover{color:#e74c3c}.bf-modal-body{overflow:auto}.bf-modal-footer{min-height:15px;padding:0
  15px;overflow:hidden}.bf-modal-addon-text{float:left;color:#999;font-size:12px;line-height:60px}.bf-modal-buttons{float:right}.bf-modal-cancel,.bf-modal-confirm{height:36px;margin:12px
  0 12px 15px;padding:0
  30px;border:none;border-radius:2px;font-size:12px;font-weight:700;cursor:pointer}.bf-modal-cancel{background-color:#e8e9ea;color:#999}.bf-modal-cancel:hover{background-color:#d8d9da}.bf-modal-confirm{background-color:#3498db;color:#fff}.bf-modal-confirm:hover{background-color:#2084c7}.bf-modal-confirm.disabled{opacity:.3;pointer-events:none;filter:grayscale(.4)}.bf-modal-root.active
  .bf-modal-mask{opacity:1}.bf-modal-root.active
  .bf-modal-content{opacity:1;transform:translate(-50%,-50%)}
  @font-face{font-family:braft-icons;src:url(data:font/woff;base64,d09GRgABAAAAACxUAAsAAAAALAgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxIH02NtYXAAAAFoAAAA9AAAAPQXCcwWZ2FzcAAAAlwAAAAIAAAACAAAABBnbHlmAAACZAAAJggAACYI9aImY2hlYWQAAChsAAAANgAAADYTSfwFaGhlYQAAKKQAAAAkAAAAJAfCBAxobXR4AAAoyAAAASwAAAEsIgAgXGxvY2EAACn0AAAAmAAAAJhQxVqgbWF4cAAAKowAAAAgAAAAIABVAH1uYW1lAAAqrAAAAYYAAAGGmUoJ+3Bvc3QAACw0AAAAIAAAACAAAwAAAAMD+QGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAQAAA6rADwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEANgAAAAyACAABAASAAEAIOAp4DTgN+BC4LjiKOI547jjwuQp6SbpMelG6WjpgOms6mjqbOpu6nXqsP/9//8AAAAAACDgJuA04DfgQuC44ijiOeO448LkKekA6SzpRuln6YDprOpo6mvqbupz6rD//f//AAH/4x/eH9Qf0h/IH1Md5B3UHFYcTRvnFxEXDBb4FtgWwRaWFdsV2RXYFdQVmgADAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAH//wAPAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAQAVQCAA6sC1QARACMANQBHAAATITIXFhUUBwYjISInJjU0NzYTITIXFhUUBwYjISInJjU0NzY3ITIXFhUUBwYjISInJjU0NzY3ITIXFhUUBwYjISInJjU0NzaAAwASDA0NDBL9ABIMDQ0MEgMAEgwNDQwS/QASDA0NDBIDABIMDQ0MEv0AEgwNDQwSAwASDA0NDBL9ABIMDQ0MAtUMDRESDQwMDRIRDQz+AAwNERINDAwNEhENDKsNDBIRDQwMDRESDA2rDQwSEgwNDQwSEgwNAAAABABVAIADqwLVABEAIwA1AEcAABMhMhcWFRQHBiMhIicmNTQ3NhMhMhcWFRQHBiMhIicmNTQ3NjchMhcWFRQHBiMhIicmNTQ3NjchMhcWFRQHBiMhIicmNTQ3NoADABIMDQ0MEv0AEgwNDQwSAlUSDA0MDRL9qxIMDQ0MEgMAEgwNDQwS/QASDA0NDBICVRIMDQwNEv2rEgwNDQwC1QwNERINDAwNEhENDP4ADA0REg0MDA0SEQ0Mqw0MEhENDAwNERIMDasNDBISDA0NDBISDA0AAAAEAFUAgAOrAtUAEQAkADYASQAAEyEyFxYVFAcGIyEiJyY1NDc2EyEyFxYVFAcGIyEiJyY1NDc2MychMhcWFRQHBiMhIicmNTQ3NjchMhcWFRQHBiMhIicmNTQ3NjOAAwASDA0NDBL9ABIMDQ0MZwJWEQ0MDA0R/aoRDQwMDRFVAwASDA0NDBL9ABIMDQ0MZwJWEQ0MDA0R/aoRDQwMDREC1QwNERINDAwNEhENDP4ADA0REg0MDA0SEQ0Mqw0MEhENDAwNERIMDasNDBISDA0NDBISDA0AAAAEAFUAgAOrAtUAEQAkADYASQAAEyEyFxYVFAcGIyEiJyY1NDc2EyEyFxYVFAcGIyEiJyY1NDc2MychMhcWFRQHBiMhIicmNTQ3NjchMhcWFRQHBiMhIicmNTQ3NjOAAwASDA0NDBL9ABIMDQ0MvQJVEgwNDQwS/asSDA0MDRKrAwASDA0NDBL9ABIMDQ0MvQJVEgwNDQwS/asSDA0MDRIC1QwNERINDAwNEhENDP4ADA0REg0MDA0SEQ0Mqw0MEhENDAwNERIMDasNDBISDA0NDBISDA0AAAACAQAAgQMAAtUAAwAHAAABMxEjIREzEQJWqqr+qqoC1f2sAlT9rAAAAQFWAIEDKgLVAAIAAAkCAVYB1P4sAtX+1v7WAAEAqgArA1YDgQAuAAABMhceARcWFRQHDgEHBiMiJy4BJyY1MxQXHgEXFjMyNz4BNzY1NCcuAScmIxUnNwIARj8+XRsbGxtdPj5HRj8+XRsbVhQURS8vNTUvL0UUFBQURS8vNdbWAtUbG1w+PkZHPj5dGxsbG10+Pkc2Li9FFBQUFEUvLjY1Ly5GFBSs1tYAAAMAMwCqA80CqwAEAAkADQAAEyEVITUDNSEVITc1IRX/As79MswCzv0yaALKAqtnZ/3/Z2fOZWUABQCAACsDgAMrAAMABwALAA8AEwAAAREhEQERIREDESERAREhEQMhESEDKv8AAQD/AFT/AAEA/wBWAwD9AAHVAQD/AP6sAQD/AAFUAQD/AP6sAQD/AAKq/QAAAAACAFYAKwNWAtUACAARAAABIRUjByc3IycnFwEHJwcjNwEBAAJW+ERaHmZ4dAwCaDbyQoBo/tgC1YCgWEh4CAr9ljbynPYBKAACAIAAKwN0Ax8AAwAWAAAlAScBAR4BDwEXBycBIzUBJzcXNzYyFwEoAVhS/qgCngwBDYZSPDz+gsoBfDw8UoYMJAyBAVhS/qgB6AwjDYZSPDz+hMoBfjw8UoYMDAAAAAAEAIAAKwOAAysACAARABoAIwAAATIWHQEjNSM1EzUzFRQGKwE1JRUzFSMiJj0BETQ2OwEVIxUjAyoiNFaqqlYzI6r+VqqqIjQzI6qqVgMrNCKqqlb9VqqqIzNWqqpWMyOqAaoiNFaqAAYAgAArA4ADKwAHAAsAEwAbAB8AIwAAAREzFTMVIxUXITUhJTMRIzUjNTMBIxEzFSEVIQEhFSERIRUhAoBWqqqq/lYBqv2qVlaqqgEAVFQBVv6q/lYBqv5WAQD/AAIrAQBWVFaqVFb/AFZU/lYBAFZUAlRU/lRUAAIAgABNA4ADTQATAB0AACUhESE1ISIGFREUFjMhMjY1ESMRAxUzARcBFTMRIQMr/aoBK/7VIzIyIwJWIzJV1pr+XDwBpFX+1aICVVYyJP2rIzIyIwEr/tUCq1b+XTwBo5kBKwAEAFUAIgOrA3cABAAhAD0AQgAAJTMRIxETIgcOAQcGFRQXHgEXFjMyNz4BNzY1NCcuAScmIxEiJy4BJyY1NDc+ATc2MzIXHgEXFhUUBw4BBwYDMzUjFQHVVlYrWE5OdCEiIiF0Tk5YWE5OdCEiIiF0Tk5YRz4+XRobGxpdPj5HRz4+XRobGxpdPj5yVlb3AQD/AAKAISJzTk5YWU1OdCEiIiF0Tk1ZWE5OcyIh/QAbG10+PkdGPz5cGxsbG1w+P0ZHPj5dGxsB1lVVAAAEAFUAIgOrA3cABAAhAD0AUgAAJTM1IxUTIgcOAQcGFRQXHgEXFjMyNz4BNzY1NCcuAScmIxEiJy4BJyY1NDc+ATc2MzIXHgEXFhUUBw4BBwYDIgYVMzQ2MzIWFRQGFTM0NjU0JiMB1VZWK1hOTnQhIiIhdE5OWFhOTnQhIiIhdE5OWEc+Pl0aGxsaXT4+R0c+Pl0aGxsaXT4+R0dkVjIjIzKAVoBkR81VVQKqISJzTk5YWU1OdCEiIiF0Tk1ZWE5OcyIh/QAbG10+PkdGPz5cGxsbG1w+P0ZHPj5dGxsCVmRHIzIyI0AtaEg9UEdkAAACAFUAzQOrAs0ABQALAAABJzcnCQElNyc3CQEBkcTEPP8AAQABGsTEPAEA/wABCcTEPP8A/wA8xMQ8/wD/AAAAAwErAM0C9QMiAA8AGQAiAAABPgE1NCYjIREhMjY1NCYnJzMyFhUUBisBNRMjNTMyFhUUBgKaHydjSP72ASxDWzIp74AaJiYagJWVlRslJQIAFkEgSWL9q19DME4TtyUbGiaA/oCAJRsaJgAAAQCAACYDgAN3ADQAAAEiBgclPgE1NCYnJR4BMzI2NTQmIyIGFRQWFwUuASMiBhUUFjMyNjcFDgEVFBYzMjY1NCYjAwAYKxH+0AICAgIBLREtGTVLSzU1SwIC/tMRLRk1S0s1GS0RATACAkk0NElJNAEfEg+xBw8IBw8IrxATSzU2Sko2Bw8HsBATSzU1SxIQsQcOBzNJSTM0SQAAAQErAU0C1QIiAAIAAAEXNwEr1dUCItXVAAAAAAMAVQAiA6sDdwAcACsAOgAAASIHDgEHBhUUFx4BFxYzMjc+ATc2NTQnLgEnJiMBNDc+ATc2MzIWFwEuATUBIiYnAR4BFRQHDgEHBiMCAFhOTXQiIiIidE1OWFhOTXQiIiIidE1OWP6rGxtcPj9GOmot/iIjJQFVOmotAd4jJRsbXD4/RgN3ISJ0Tk1YWE5OdCEiIiF0Tk5YWE1OdCIh/lZGPj5dGxslI/4iLWo6/qomIwHeLWs5Rz4+XRsbAAAAAAMAgADNA4ACzQADAAcACwAANyE1ITUhNSE1FSE1gAMA/QADAP0AAwDNVYBV1lZWAAEBKwF3AtUCTQACAAABNxcBK9XVAXfW1gAAAAADAasAdwJVAyIADAAYACQAAAEyNjU0JiMiBhUUFjMVIgYVFBYzMjY1NCYDIgYVFBYzMjY1NCYCACMyMiMjMjIjIzIyIyMyMiMjMjIjIzIyAnczIyMyMiMjM1UyIyMzMyMjMv8AMiMjMzMjIzIAAAAAAwCrAXcDVQIiAAwAGAAkAAABIgYVFBYzMjY1NCYjISIGFRQWMzI2NTQmISIGFRQWMzI2NTQmAQAjMjIjIzIyIwIAIzIyIyMyMv7dIzIyIyMyMgIiMiMjMzMjIzIyIyMzMyMjMjIjIzMzIyMyAAAAAAIAAP/ABAADgAApAC0AAAERIzU0JiMhIgYdARQWMyEyNj0BMxEhFSMiBhURFBY7ATI2NRE0JisBNQEhNSEEAMAmGv1AGiYmGgLAGiaA/cAgDRMTDYANExMNIAFA/UACwAGAAYBAGiYmGsAaJiYaQP8AgBMN/sANExMNAUANE0ABgEAAAAQA1QCiAysC9wAGAA0AEwAaAAATMxUzNSMVEyMVMzUjFQEzNTM1IxM1IxUzNSPVgFbWgIDWVgEAVoDWVlbWgAEigNVVAVVV1YD+K4BVAQCA1VUAAAEAZAAlA1wDXABEAAABERQHBgcGBwYjIicmJyYnJjU0NzY3Njc2MzIXEQURFAcGBwYHBiMiJyYnJicmNTQ3Njc2NzYzMhcRNDc2NyU2MzIXFhUDXBERGhkaGRYXGRoZGhEREREaGRoZFzMr/oURERoZGhkXFhkaGRoRERERGhkaGRY0KwoJDwGbBggUDg4DLP3WGBQTCgsFBQUFCwoTFBgZExQKCwUFEwEKdv6iGRMTCwsFBQUFCwsTExkZExMLCgYFEwHeDw0MBX8CDg4UAAAEAHUAQgOJA1YALwA8AGIAeAAAAS4BBw4BJy4BJy4BBwYiJyYGBw4BJyYGBxQVHAEVFBUeATM2MzoBMzIzMjY3PAE1BSImNTQ2MzIWFRQGJyUqASM8ATU6ATMUFhUUFxwBFQYHFAYHDgEnLgE3PgE3OgEzPAE1BT4BNzoBMxQWBw4BJy4BNz4BNzoBMwKBARkZChUJCxcEFEMvBw8HHikMDCgdFyILCxgWNDM0ZzQzNBsaAf77L0FBMDBAQDEBtx8/IDRoNgEBAQENCxVFICIlBgc3JAcNCf7OAQICEyQTAwUFSiMmOAIBOiYHEAkCzhcaAQEBAwIJCC0fCAEBBhgbGxYGBBMVKCgpUCgoKQ8VARcaSpRK7T8uMEA/LzBAARchPyAKEgkzMjNmMjMzFCwRIBAOD0IjJjQDN2053QwUCi5dLSUsBgVEJig+BAAAAAAEANUAogMrAvcABQALABEAFwAAASMVMzUjAzM1MzUjASMVMzUjAxUzFTM1AStW1oBWVoDWAgCA1laAgFYBd9VVASuAVf4AVdUBgFWA1QAAAAQAAAAABAADQAAbADMATwBTAAABFBceARcWMzI3PgE3NjU0Jy4BJyYjIgcOAQcGASMuASMhIgYHIyIGFREUFjMhMjY1ETQmASInLgEnJjU0Nz4BNzYzMhceARcWFRQHDgEHBgEjNTMBMBAROCYmKysmJjgREBAROCYmKysmJjgREAKQ4AwkMP8AMCQM4BomJhoDgBomJv4mOzQzTRcWFhdNMzQ7OzQzTRcWFhdNMzQBhYCAAWArJiY4ERAQETgmJisrJiY4ERAQETgmJgE1MFBQMCYa/cAaJiYaAkAaJv2EFhdNMzQ7OzQzTRcWFhdNMzQ7OzQzTRcWAbxAAAEAkQCiA4AC3gAGAAABJwcXAScBAYCzPO8CADz+PAEaszzvAgA8/jwAAAAAAQDiAIADHgLJACYAAAE3NjQnJiIPAScmIgcGFB8BBwYUFx4BMzI2PwEXHgEzMjY3NjQvAQI84g0NDCQM4uIMJAwNDeLiDQ0GEAgIEAbi4gYQCAgQBg0N4gGr4gwjDQwM4uIMDA0jDOLiDSMMBwYGB+HhBwYGBwwjDeIAAAUAVQCVA6sC6wAZACoARABeAHgAAAEhIgYHDgEVFBYXHgEzITI2Nz4BNTQmJy4BJTQmIyEiBh0BFBYzITI2PQEDISIGBw4BFRQWFx4BMyEyNjc+ATU0JicuAQMhIgYHDgEVFBYXHgEzITI2Nz4BNTQmJy4BBSEiBgcOARUUFhceATMhMjY3PgE1NCYnLgEB1f6rCQ8GBgcHBgYPCQFVCQ8GBwYGBwYPAc0ZEv8AEhkZEgEAEhkr/QAJDwYGBwcGBg8JAwAJDwYGBwcGBg8J/QAJDwYGBwcGBg8JAwAJDwYGBwcGBg/+TP6rCQ8GBgcHBgYPCQFVCQ8GBwYGBwYPAZUGBgYQCAkPBgcGBgcGDwkIEAYGBoERGRkRrBEZGRGs/tUHBgYPCQkPBgYHBwYGDwkJDwYGBwIABwYGDwkJDwYGBwcGBg8JCQ8GBgerBgcGDwkIEAYGBgYGBhAICQ8GBwYAAAAABABVAE0DqwNNAA4AEgAeACIAAAEhIgYVETMVITUzETQmIwMhNSE3IiY1NDYzMhYVFAYDIRUhAyv9qjVLqwIAq0s1gP6qAVaAEhkZEhEZGTz+AAIAAndKNv8AqqoBADZK/ivVVhkREhkZEhEZAYCrAAIAgABjA2oDTQAiAC8AAAEjJz4BNTQnLgEnJiMiBw4BBwYVFBceARcWMzI2NxcVFzcnISImNTQ2MzIWFRQGIwKVIQwfJBYWSzMyOjkzMksWFhYWSzIzOTRcJQvWP9X/AE9xcU9QcHBQAXcMJF0zOjIzSxYWFhZLMzI6OTIzSxYWJB8MItQ/1XFPUHBwUE9xAAIAZAAiA5wDdwBNAFkAAAE+ATU0Jic3PgEvAS4BDwEuAS8BLgErASIGDwEOAQcnJgYPAQYWHwEOARUUFhcHDgEfAR4BPwEeAR8BHgE7ATI2PwE+ATcXFjY/ATYmJwUiJjU0NjMyFhUUBgM9AQICAVoGAwRVBA8HahEkFBABDAiqCAwBEBQkEWoHDwRVBAMGWgECAgFaBgMEVQQPB2oRJBQQAQwIqggMARAUJBFqBw8EVQQDBv5pPldXPj5XVwGjChULCxQLRgUPB5QHBQMqDBUIcgcKCgdyCBUMKgMFB5QHDwVGCxUKCxUKRgUQB5MHBQIrDRUIcQgKCghxCBUNKwMGB5MHEAUmWD4+V1c+PlgAAQDVAKIDKwL3AAsAAAEhESMRITUhETMRIQMr/wBW/wABAFYBAAGi/wABAFUBAP8AAAAAAAQAVf/vA6sC7wAeADMAOAA9AAATNwEHJyM1JyM1Jw4BFRQWOwEVIyInLgEnJjU0NjcnBTIXHgEXFhUUBgcnPgE1NCYrATUzITMVIycFFSMnM1U3Ask2q0mMSmogJWdIgIA1Li9FFRQyKlwCVjUuL0UVFEc5PC88Z0iAgP6qgDZRAV0zVYgCuTb9NzerSYxKaxhIKklmURQURS8vNTpnIlwfFRRFLy41R3YhPRRWN0hnUVFR1lVVAAADAFUAmgOrApoAGgA1ADkAAAEjFTMyFhUUBisBFTMyNz4BNzY1NCcuAScmIwE0NjsBNSMiBw4BBwYVFBceARcWOwE1IyImNRchNSECq4CASGdnSICANS4vRRUUFBVFLy41/ftnSICANS4vRRUUFBVFLy41gIBIZ68BVv6qAppRZ0hJZlEUFEUvLzU1Li9FFRT/AEhnURUURS8uNTUvL0UUFFFmSStVAAAFAFUAIgOrA3cAHAA4AEQAUABYAAABIgcOAQcGFRQXHgEXFjMyNz4BNzY1NCcuAScmIxEiJy4BJyY1NDc+ATc2MzIXHgEXFhUUBw4BBwYTMjY1NCYjIgYVFBYhMjY1NCYjIgYVFBYTMjY3IR4BMwIAWU1OdCEiIiF0Tk1ZWE5OdCEiIiF0Tk5YRz4+XRsaGhtdPj5HRz4+XRsaGhtdPj5OGyUlGxomJv7wGiYmGhslJbBLdRr+TBp1SwN3ISJzTk5YWU1OdCEiIiF0Tk1ZWE5OcyIh/QAbG10+PkdHPj5dGhsbGl0+PkdHPj5dGxsBgCYaGyUlGxomJhobJSUbGib+61RBQVQAAAAJAAAAQAQAA0AAAwAHAAsADwATABcAGwAfACIAABMRIREBIzUzNSM1MzUjNTMBIREhEyM1MzUjNTM1IzUzBRElAAQA/MCAgICAgIACQP4AAgDAgICAgICA/cABAANA/QADAP1AgICAgID9gAKA/YCAgICAgID+gMAAAAAAAgDVAE0DKwNNABkAHgAAJTI3PgE3NjURIxEUBiMiJjURIxEUFx4BFxYHFSE1IQIANS8uRhQUa1c+PldrFBRGLi/2Alb9qvcVFEUvLzQBVv6qPVhYPQFW/qo0Ly9FFBVVVVUAAAUAVQCVA6sC6wAaACsARQBfAHoAAAEhMhYXHgEVFAYHDgEjISImJy4BNTQ2Nz4BMyU0NjMhMhYdARQGIyEiJj0BEyEyFhceARUUBgcOASMhIiYnLgE1NDY3PgETITIWFx4BFRQGBw4BIyEiJicuATU0Njc+AQUhMhYXHgEVFAYHDgEjISImJy4BNTQ2Nz4BMwIrAVUJDwYGBwcGBg8J/qsJDwYHBgYHBg8J/ioZEgEAEhkZEv8AEhkrAwAJDwYGBwcGBg8J/QAJDwYGBwcGBg8JAwAJDwYGBwcGBg8J/QAJDwYGBwcGBg8BtAFVCQ8GBgcHBgYPCf6rCQ8GBwYGBwYPCQGVBgYGEAgJDwYHBgYHBg8JCBAGBgaBERkZEawRGRkRrP7VBwYGDwkJDwYGBwcGBg8JCQ8GBgcCAAcGBg8JCQ8GBgcHBgYPCQkPBgYHqwYHBg8JCBAGBgYGBgYQCAkPBgcGAAAAAAMAgACiA4ADIgAEAA0AEQAAJTM1IxUDFTMVMzUzNSEDITUhAauqqtbWqtb9qlUDAP0AooCAAoCAgICA/lVWAAACAIAAogOrAyIACAARAAABFTMRMxEzNSEBMxEzETM1IRUBgNWA1v3V/wCAgID+gAMigP4AAgCA/qv+1QErgIAAAgDVAPcDKwKiAAYADQAAJTM3ESERMwUzNxEhETMBAIBV/wCAAQCAVv8AgPerAQD/AKurAQD/AAAGAFUAdwOAAyIACwASAB0AIgAnACwAADczFSMVMxUjFTM1IxMzNSMVMxUHMwcVMzUjNzUjFRMVITUhESE1IRURITUhFVVWKytWgIArK1YrK01NgExMgNYCVf2rAlX9qwJV/av3FSsVK6sBVasrgIBZJytaJisBAFVV/atVVQEAVVUAAAAGAGsAjQOAAw0ACwAXACMAKAAtADIAABMiBhUUFjMyNjU0JgMiBhUUFjMyNjU0JgMiBhUUFjMyNjU0JhchNSEVESE1IRURFSE1IasbJSUbGiYmGhslJRsaJiYaGyUlGxomJmYCVf2rAlX9qwJV/asCDSYaGyUlGxomAQAmGhslJRsaJv4AJhoaJiYaGiZrVVUBAFVVAVVVVQAAAAABAQAAzQMAAyIACwAAARUzAyMVITUjEzM1AatekncBVV6SdwMigP6rgIABVYAAAAABAAABawQAAesAAwAAEyEVIQAEAPwAAeuAAAAABgBA/8ADwAPAABkAIQA5AEcAVQBjAAABLgEnLgEnLgEjISIGFREUFjMhMjY1ETQmJyceARcjNR4BExQGIyEiJjURNDYzMDM6ATMyMRUUFjsBAyEiJjU0NjMhMhYVFAYnISImNTQ2MyEyFhUUBichIiY1NDYzITIWFRQGA5YRLRkaMxcnKQv+ECEvLyEC4CEvDhyFFyUNmhEphgkH/SAHCQkHTU66TU4TDeCg/kANExMNAcANExMN/kANExMNAcANExMN/kANExMNAcANExMC2xczGhktERwOLyH8oCEvLyECcAspJzYXKRGaDSX86AcJCQcDYAcJ4A0T/gATDQ0TEw0NE4ATDQ0TEw0NE4ATDQ0TEw0NEwAAAAUAAP/ABAADwAAIAAsAEwAWABwAAAERIQcRIREhESUVIwMRMzUhFQcRExUjASERMzUhAoD+QMABgAKA/MBlG8ABQMDAZQHl/gDAAUACwAEAwP3A/wADAKVl/gABwMDAwP8AAWVl/gABwMAAAAUAQP/ABAADwAANABgANAA3AD0AAAEjNTQmKwEiBh0BIxUhJyM1OAExMzgBMRUFNTQmKwEVMxUjBxEhETM1IyIGFREUFjMhFSERBRUjASERMzUhAsCAJhqAGiaAAgDAgIABQBMNQCDAwP8AIEANExMNASACgP5AZQHl/gDAAUADQEAaJiYaQICAQEDAoA0TQIDA/wACQEATDf2ADRPAAsBbZf5AAYDAAAYAgABNA4ADTQADAAcACwAPABMAFwAANyE1IRkBNycBITUhARUhNQEhNSERITUhgAMA/QCrqwFVAav+Vf6rAwD+VQGr/lUBq/5VTVUB1f6rq6r+gFYCAFZW/wBV/wBVAAYAgABNA4ADTQADAAcACwAPABMAFwAAJSE1ISUXEQcRITUhERUhNQEhNSERITUhAdUBq/5V/qurqwMA/QADAP5VAav+VQGr/lX3VoCrAVWq/oBVAqtWVv8AVf8AVQAAAAEAAP/NBAAAdwADAAA3IRUhAAQA/AB3qgAAAAACAOsA9wMVA00ACAAMAAABAzM3IRczAyMDGwEjAdXqYC8BCzBg6lY7ZmbMA039qoCAAlb+gAEO/vIAAAACAAD/wAQAA8AADgASAAABBxcDIxcBFTMBFzUlFzcFJzcXAiBgYODgsP7wJwFpsAEAYGD9wEDgQAPAYGD/ALD+lycBELDg4GBgQEDgQAAAAAEAQP/AA4oDwAARAAAFNjc2JicmBxUJARU2Fx4BBwYC+isTEzhVVqj+gAGAyXFyRignQE1bW5ozMgT+AYABgPgFTk7siokAAAEAdv/AA8ADwAASAAABNQkBNSYHDgEXFhcmJyY2NzYXAkABgP6AqFZVOBMTK2knKEZycckCyPj+gP6A/gQyM5pbW01yiYrsTk4FAAAHAAD/wAQAA0YACwAXACMALwA7AEcAUwAAJTQ2MzIWFRQGIyImATQ2MzIWFRQGIyImJTQ2MzIWFRQGIyImATQ2MzIWFRQGIyImATQ2MzIWFRQGIyImJTQ2MzIWFRQGIyImATQ2MzIWFRQGIyImAaA4KCg4OCgoOP5gOCgoODgoKDgDQDgoKDg4KCg4/To4KCg4OCgoOAJMOCgoODgoKDj9tDgoKDg4KCg4Akw4KCg4OCgoOCAoODgoKDg4AcgoODgoKDg4KCg4OCgoODgBTig4OCgoODj93Cg4OCgoODgoKDg4KCg4OAJ0KDg4KCg4OAAFAHwAAAOEA1UAIgAtADgARgBUAAABIzU0JisBIgYdASMiBhUUFjsBERQWMyEyNjURMzI2NTQmIyU0NjsBMhYdASM1ARQGIyEiJjURIREBIgYdARQWMzI2PQE0JjMiBh0BFBYzMjY9ATQmA12bRDCcMESbEBcXECdEMAGEMEQnEBcXEP4vFhCcEBboAV0XEP58EBcB0v7JEBYWEBAXF4wQFxcQEBYWAronMEREMCcXEBAW/gcwREQwAfkWEBAXJxAXFxAnJ/2TEBYWEAH5/gcBhBcQ6BAXFxDoEBcXEOgQFxcQ6BAXAAAABwAA/8AEAAPAAAMABwALAA8AEwAbACMAABMzFSM3MxUjJTMVIzczFSMlMxUjAxMhEzMTIRMBAyEDIwMhAwCAgMDAwAEAgIDAwMABAICAEBD9ABAgEAKAEP1AEAMAECAQ/YAQAcBAQEBAQEBAQEACQP5AAcD+gAGA/AABgP6AAUD+wAAABABQAIAEAAPAAAgADQAQAEAAAD8BIRczAyMDMxMzFyM3ARsBAyMiJjU0NjsBMjY1NCYrASIGFRQWFx4BOwEyFhUUBisBIgYVFBY7ATI2NTQmJy4BwjoBCDpywODAcppIOrw6AWSgoKBADRMTDYANExMNgCg4DQwNJRVADRMTDYANExMNgCg4DQwNJYDAwAKA/YACAMDA/gABAP8AAsATDQ0TEw0NEzgoEiENDxETDQ0TEw0NEzgoEiENDxEAAAAABABQ/8AEAAMAAAgADQAQAEAAAD8BIRczAyMDMxMzFyM3JQsBEyMiJjU0NjsBMjY1NCYrASIGFRQWFx4BOwEyFhUUBisBIgYVFBY7ATI2NTQmJy4BwjoBCDpywODAcppIOrw6AqSgoKBADRMTDYANExMNgCg4DQwNJRVADRMTDYANExMNgCg4DQwNJYDAwAKA/YACAMDAgP8AAQD9gBMNDRMTDQ0TOCgSIQ0PERMNDRMTDQ0TOCgSIQ0PEQAHAAD/wAQAA8AABwAPABMAFwAbAB8AIgAAAREhESMRIREFESERMxEhESUzFSMnMxUjJTMVIzczFSMlFwcBAAMAQP2AAsD9AEACgP5AgIDAgIABgICAwICA/IDAwAJAAYD+gAFA/sDA/kABwP6AAYCAQEBAQEBAQODAwAAAAQCA/8ADgAPAABcAAAEhFSMRIxEjESMRIicuAScmNTQ3PgE3NgGAAgCAgICANS8uRhQUFBRGLi8DwID8gAOA/IACABQURi4vNTUvLkYUFAACAAD/wAQAA8AAFwAaAAABIgcOAQcGFRQXHgEXFjMRMxEzETMRMzUJAgIANS8uRhQUFBRGLi81gICAgPwAAQD/AAPAFBRGLi81NS8uRhQU/gADgPyAA4CA/UABAAEAAAACAAD/wAQAA8AAFwAaAAABIgcOAQcGFRQXHgEXFjMRMxEzETMRMzUFCQEBADUvLkYUFBQURi4vNYCAgIABAP8AAQADwBQURi4vNTUvLkYUFP4AA4D8gAOAgMD/AP8AAAABAAD/zgQAA7MAYwAAASIHDgEHBhUUFx4BFxYXFjY1PAEnBiYxLgExJjYxHgExFjY3PgE3JicuAScmNTQ2Ny4BNzAWFz4BMzIWFz4BMRYGBx4BFRQHDgEHBgceARUUBhUUFjc2Nz4BNzY1NCcuAScmIwIAal1eiygoGhpdQUBMExABakISJyMnJigiXRYEEgsrKipCFBUcGQQMFUNKHkEhIUEeSkMVDAQZHBUUQyopKw4VARATTEFAXRoaKCiLXl1qA7MoKItdXmpUTU2ALy8ZBBIKCTYgF1QsHxgHAzI7BwoYIgoFDA04Ly9JKkUbCUk1AzEICQkIMQM1SQkbRSpKLy44DA0FCzAjNEwNChIEGS8wf01NVGpeXYsoKAAAAAABAAAAAQAAt9HlfV8PPPUACwQAAAAAANgVW8QAAAAA2BVbxAAA/8AEAAPAAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAQAAAEAAAAAAAAAAAAAAAAAAABLBAAAAAAAAAAAAAAAAgAAAAQAAFUEAABVBAAAVQQAAFUEAAEABAABVgQAAKoEAAAzBAAAgAQAAFYEAACABAAAgAQAAIAEAACABAAAVQQAAFUEAABVBAABKwQAAIAEAAErBAAAVQQAAIAEAAErBAABqwQAAKsEAAAABAAA1QQAAGQEAAB1BAAA1QQAAAAEAACRBAAA4gQAAFUEAABVBAAAgAQAAGQEAADVBAAAVQQAAFUEAABVBAAAAAQAANUEAABVBAAAgAQAAIAEAADVBAAAVQQAAGsEAAEABAAAAAQAAEAEAAAABAAAQAQAAIAEAACABAAAAAQAAOsEAAAABAAAQAQAAHYEAAAABAAAfAQAAAAEAABQBAAAUAQAAAAEAACABAAAAAQAAAAEAAAAAAAAAAAKABQAHgCIAPIBXgHKAd4B7AI0AlACfgKiAtIDBgNCA3QD2gRSBHIEqAT2BQQFZAV8BYoFwgX6BjwGZgbOB3YHnggcCDIIcAkiCVoJogoqCkQKoAr0C3gLtgvoDJwMvAzcDPgNOg2IDaANrg46DnAOxA70DyQPMg9QD3gPnA/CEDoQrhDwEVARrhHsEhQSRBJ0EwQAAQAAAEsAewAJAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAcAAAABAAAAAAACAAcAYAABAAAAAAADAAcANgABAAAAAAAEAAcAdQABAAAAAAAFAAsAFQABAAAAAAAGAAcASwABAAAAAAAKABoAigADAAEECQABAA4ABwADAAEECQACAA4AZwADAAEECQADAA4APQADAAEECQAEAA4AfAADAAEECQAFABYAIAADAAEECQAGAA4AUgADAAEECQAKADQApGljb21vb24AaQBjAG8AbQBvAG8AblZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMGljb21vb24AaQBjAG8AbQBvAG8Abmljb21vb24AaQBjAG8AbQBvAG8AblJlZ3VsYXIAUgBlAGcAdQBsAGEAcmljb21vb24AaQBjAG8AbQBvAG8AbkZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=);font-weight:400;font-style:normal}
  .bf-container
  [class*=" bfi-"],.bf-container [class^=bfi-],.bf-modal-root [class*=" bfi-"],.bf-modal-root
  [class^=bfi-]{font-family:braft-icons!important;speak:none;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.bf-container
  .bfi-table:before,.bf-modal-root .bfi-table:before{content:"\e228"}.bf-container
  .bfi-clear_all:before,.bf-modal-root .bfi-clear_all:before{content:"\e0b8"}.bf-container
  .bfi-format_clear:before,.bf-modal-root .bfi-format_clear:before{content:"\e239"}.bf-container
  .bfi-hr:before,.bf-modal-root .bfi-hr:before{content:"\e925"}.bf-container
  .bfi-colorize:before,.bf-modal-root .bfi-colorize:before{content:"\e3b8"}.bf-container
  .bfi-crop_free:before,.bf-modal-root .bfi-crop_free:before{content:"\e3c2"}.bf-container
  .bfi-pause:before,.bf-modal-root .bfi-pause:before{content:"\e034"}.bf-container
  .bfi-play_arrow:before,.bf-modal-root .bfi-play_arrow:before{content:"\e037"}.bf-container
  .bfi-bin:before,.bf-modal-root .bfi-bin:before{content:"\e9ac"}.bf-container
  .bfi-replay:before,.bf-modal-root .bfi-replay:before{content:"\e042"}.bf-container
  .bfi-tune:before,.bf-modal-root .bfi-tune:before{content:"\e429"}.bf-container
  .bfi-close:before,.bf-modal-root .bfi-close:before{content:"\e913"}.bf-container
  .bfi-align-center:before,.bf-modal-root .bfi-align-center:before{content:"\e028"}.bf-container
  .bfi-align-justify:before,.bf-modal-root .bfi-align-justify:before{content:"\e026"}.bf-container
  .bfi-align-left:before,.bf-modal-root .bfi-align-left:before{content:"\e027"}.bf-container
  .bfi-align-right:before,.bf-modal-root .bfi-align-right:before{content:"\e029"}.bf-container
  .bfi-image-right:before,.bf-modal-root .bfi-image-right:before{content:"\e914"}.bf-container
  .bfi-image-left:before,.bf-modal-root .bfi-image-left:before{content:"\e91e"}.bf-container
  .bfi-music:before,.bf-modal-root .bfi-music:before{content:"\e90e"}.bf-container
  .bfi-camera:before,.bf-modal-root .bfi-camera:before{content:"\e911"}.bf-container
  .bfi-copy:before,.bf-modal-root .bfi-copy:before{content:"\e92c"}.bf-container
  .bfi-file-text:before,.bf-modal-root .bfi-file-text:before{content:"\e926"}.bf-container
  .bfi-film:before,.bf-modal-root .bfi-film:before{content:"\e91c"}.bf-container
  .bfi-github:before,.bf-modal-root .bfi-github:before{content:"\eab0"}.bf-container
  .bfi-ltr:before,.bf-modal-root .bfi-ltr:before{content:"\ea74"}.bf-container
  .bfi-page-break:before,.bf-modal-root .bfi-page-break:before{content:"\ea68"}.bf-container
  .bfi-pagebreak:before,.bf-modal-root .bfi-pagebreak:before{content:"\ea6e"}.bf-container
  .bfi-paint-format:before,.bf-modal-root .bfi-paint-format:before{content:"\e90c"}.bf-container
  .bfi-paste:before,.bf-modal-root .bfi-paste:before{content:"\e92d"}.bf-container
  .bfi-pilcrow:before,.bf-modal-root .bfi-pilcrow:before{content:"\ea73"}.bf-container
  .bfi-pushpin:before,.bf-modal-root .bfi-pushpin:before{content:"\e946"}.bf-container
  .bfi-redo:before,.bf-modal-root .bfi-redo:before{content:"\e968"}.bf-container
  .bfi-rtl:before,.bf-modal-root .bfi-rtl:before{content:"\ea75"}.bf-container
  .bfi-spinner:before,.bf-modal-root .bfi-spinner:before{content:"\e980"}.bf-container
  .bfi-subscript:before,.bf-modal-root .bfi-subscript:before{content:"\ea6c"}.bf-container
  .bfi-superscript:before,.bf-modal-root .bfi-superscript:before{content:"\ea6b"}.bf-container
  .bfi-undo:before,.bf-modal-root .bfi-undo:before{content:"\e967"}.bf-container
  .bfi-media:before,.bf-modal-root .bfi-media:before{content:"\e90f"}.bf-container
  .bfi-add:before,.bf-modal-root .bfi-add:before{content:"\e918"}.bf-container
  .bfi-bold:before,.bf-modal-root .bfi-bold:before{content:"\e904"}.bf-container
  .bfi-code:before,.bf-modal-root .bfi-code:before{content:"\e903"}.bf-container
  .bfi-done:before,.bf-modal-root .bfi-done:before{content:"\e912"}.bf-container
  .bfi-drop-down:before,.bf-modal-root .bfi-drop-down:before{content:"\e906"}.bf-container
  .bfi-drop-up:before,.bf-modal-root .bfi-drop-up:before{content:"\e909"}.bf-container
  .bfi-emoji:before,.bf-modal-root .bfi-emoji:before{content:"\e91b"}.bf-container
  .bfi-font-size:before,.bf-modal-root .bfi-font-size:before{content:"\e920"}.bf-container
  .bfi-fullscreen:before,.bf-modal-root .bfi-fullscreen:before{content:"\e910"}.bf-container
  .bfi-fullscreen-exit:before,.bf-modal-root .bfi-fullscreen-exit:before{content:"\e90d"}.bf-container
  .bfi-help:before,.bf-modal-root .bfi-help:before{content:"\e902"}.bf-container
  .bfi-indent-decrease:before,.bf-modal-root .bfi-indent-decrease:before{content:"\e92f"}.bf-container
  .bfi-indent-increase:before,.bf-modal-root .bfi-indent-increase:before{content:"\e92e"}.bf-container
  .bfi-info:before,.bf-modal-root .bfi-info:before{content:"\e901"}.bf-container
  .bfi-italic:before,.bf-modal-root .bfi-italic:before{content:"\e924"}.bf-container
  .bfi-link:before,.bf-modal-root .bfi-link:before{content:"\e91a"}.bf-container
  .bfi-link-off:before,.bf-modal-root .bfi-link-off:before{content:"\e919"}.bf-container
  .bfi-list:before,.bf-modal-root .bfi-list:before{content:"\e923"}.bf-container
  .bfi-list-numbered:before,.bf-modal-root .bfi-list-numbered:before{content:"\e922"}.bf-container
  .bfi-menu:before,.bf-modal-root .bfi-menu:before{content:"\e908"}.bf-container
  .bfi-more-horiz:before,.bf-modal-root .bfi-more-horiz:before{content:"\e90b"}.bf-container
  .bfi-more-vert:before,.bf-modal-root .bfi-more-vert:before{content:"\e90a"}.bf-container
  .bfi-not-disturb:before,.bf-modal-root .bfi-not-disturb:before{content:"\e907"}.bf-container
  .bfi-print:before,.bf-modal-root .bfi-print:before{content:"\e915"}.bf-container
  .bfi-quote:before,.bf-modal-root .bfi-quote:before{content:"\e921"}.bf-container
  .bfi-search:before,.bf-modal-root .bfi-search:before{content:"\e916"}.bf-container
  .bfi-settingsx:before,.bf-modal-root .bfi-settingsx:before{content:"\e917"}.bf-container
  .bfi-share:before,.bf-modal-root .bfi-share:before{content:"\e905"}.bf-container
  .bfi-share-square:before,.bf-modal-root .bfi-share-square:before{content:"\e900"}.bf-container
  .bfi-strikethrough:before,.bf-modal-root .bfi-strikethrough:before{content:"\e91f"}.bf-container
  .bfi-text-color .path1:before,.bf-modal-root .bfi-text-color
  .path1:before{font-family:braft-icons!important;content:"\e930";opacity:.36}.bf-container
  .bfi-text-color .path2:before,.bf-modal-root .bfi-text-color
  .path2:before{font-family:braft-icons!important;content:"\e931";margin-left:-1em}.bf-container
  .bfi-underlined:before,.bf-modal-root
  .bfi-underlined:before{content:"\e91d"}.bf-content{height:500px;padding-bottom:10px;overflow:auto;font-size:16px}.bf-content
  img{user-select:none}.bf-content
  *{line-height:normal}.bf-container{position:relative;height:100%;padding:0}.bf-container.disabled{pointer-events:none;opacity:.7;filter:grayscale(70%)}.bf-container.read-only
  .bf-controlbar{pointer-events:none}.bf-container.read-only .bf-image
  img:hover{outline:none}.bf-container.read-only
  .bf-hr{pointer-events:none}.bf-container.fullscreen{position:fixed;display:flex;flex-direction:column;z-index:99999;top:0;right:0;bottom:0;left:0;background-color:#fff;height:100%!important}.bf-container.fullscreen
  .bf-content{flex-grow:1;height:auto}.bf-container .input-group{display:block}.bf-container
  .input-group input{box-sizing:border-box;width:100%;height:36px;padding:0
  15px;font-size:14px}.bf-container .pull-left{float:left}.bf-container
  .pull-right{float:right}.bf-container button{line-height:normal}.bf-container
  button.default,.bf-container button.ghost,.bf-container button.primary{height:32px;padding:0
  20px;color:#fff;font-size:12px}.bf-container
  button.default{background-color:hsla(0,0%,100%,.15);border:none}.bf-container
  button.default:hover{background-color:hsla(0,0%,100%,.1)}.bf-container
  button.ghost{background-color:transparent;border:none;box-shadow:inset 0 0 0 .5px
  hsla(0,0%,100%,.5)}.bf-container button.ghost:hover{box-shadow:inset 0 0 0 .5px
  hsla(0,0%,100%,.7)}.bf-container
  button.primary{background-color:#3498db;border:none;color:#fff}.bf-container
  button.primary:hover{background-color:#2084c7}.bf-container
  .public-DraftEditorPlaceholder-root{top:15px;left:15px;font-size:16px;pointer-events:none}.bf-container
  .DraftEditor-editorContainer{box-sizing:border-box;border:none}.bf-container
  .DraftEditor-root,.bf-container .public-DraftEditor-content{height:100%}.bf-container
  .public-DraftEditor-content{box-sizing:border-box;padding:15px;word-wrap:break-word;word-break:break-all}.bf-container
  .public-DraftEditor-content>div{padding-bottom:20px}.bf-container .public-DraftEditor-content
  .braft-link{color:#4078c0}.bf-container .public-DraftEditor-content blockquote{margin:0 0
  10px;padding:15px 20px;background-color:#f1f2f3;border-left:5px solid
  #ccc;color:#666;font-style:italic}.bf-container .public-DraftEditor-content
  pre{max-width:100%;max-height:100%;margin:10px
  0;padding:15px;overflow:auto;background-color:#f1f2f3;border-radius:3px;color:#666;font-family:monospace;font-size:14px;font-weight:400;line-height:16px;word-wrap:break-word;white-space:pre-wrap}.bf-container
  .public-DraftEditor-content pre pre{margin:0;padding:0}.bf-container .bfa-left,.bf-container
  .bfa-left .public-DraftStyleDefault-ltr{text-align:left}.bf-container .bfa-right,.bf-container
  .bfa-right .public-DraftStyleDefault-ltr{text-align:right}.bf-container .bfa-center,.bf-container
  .bfa-center .public-DraftStyleDefault-ltr{text-align:center}.bf-container .bfa-justify,.bf-container
  .bfa-justify .public-DraftStyleDefault-ltr{text-align:justify}.bf-container
  .bfa-center>div,.bf-container .bfa-justify>div,.bf-container .bfa-left>div,.bf-container
  .bfa-right>div{display:inline-block}.bf-container .bff-left:hover,.bf-container
  .bff-right:hover{z-index:2}.bf-container .bff-left{position:relative;z-index:1;float:left;margin:0
  10px 0 0}.bf-container .bff-right{position:relative;z-index:1;float:right;margin:0 0 0
  10px}.bf-container .bftd-1{text-indent:2em;display:initial}.bf-container
  .bftd-2{text-indent:4em;display:initial}.bf-container
  .bftd-3{text-indent:6em;display:initial}.bf-container
  .bftd-4{text-indent:8em;display:initial}.bf-container
  .bftd-5{text-indent:10em;display:initial}.bf-container
  .bftd-6{text-indent:12em;display:initial}.bf-container .bf-image,.bf-container
  .bf-media{position:relative}.bf-container .bf-image
  img{display:block;max-width:100%;font-size:0;resize:both;outline-offset:1px}.bf-container .bf-image
  img:hover{outline:1px solid #3498db}.bf-container
  .bf-media-toolbar{position:absolute;z-index:3;bottom:15px;left:50%;width:auto;background-color:#21242a;border-radius:2px;font-weight:400;text-align:center;white-space:nowrap;transform:translateX(-50%);box-shadow:0
  5px 15px rgba(0,0,0,.2);user-select:none}.bf-container .bf-media-toolbar
  .bf-media-toolbar-arrow,.bf-container
  .bf-media-toolbar:before{position:absolute;bottom:-10px;left:50%;display:block;border:5px solid
  transparent;border-top-color:#21242a;content:"";transform:translateX(-5px)}.bf-container
  .bf-media-toolbar
  a{display:inline-block;min-width:40px;height:40px;color:hsla(0,0%,100%,.5);font-family:braft-icons!important;font-size:18px;font-weight:400;line-height:40px;text-align:center;text-decoration:none;text-transform:uppercase;cursor:pointer}.bf-container
  .bf-media-toolbar a:hover{color:#fff}.bf-container .bf-media-toolbar a:first-child{border-radius:2px
  0 0 2px}.bf-container .bf-media-toolbar a:last-child{border-radius:0 2px 2px 0}.bf-container
  .bf-media-toolbar a.active{color:#3498db}.bf-audio-player audio{width:480px;max-width:80vw;margin:0
  10px 10px}.bf-video-player video{display:block;width:640px;max-width:80vw;height:auto;margin:0 10px
  10px;object-fit:contain}.bf-content
  .bf-hr{position:relative;box-sizing:content-box;height:15px;padding-top:15px;text-align:center}.bf-content
  .bf-hr:before{display:block;height:1px;background-color:rgba(0,0,0,.1);content:""}.bf-content
  .bf-hr:hover:before{background-color:rgba(0,0,0,.3)}.bf-content .bf-hr:hover
  .bf-media-toolbar{display:block}.bf-content .bf-hr
  .bf-media-toolbar{display:none}.bf-link-editor{width:360px;padding-top:25px}.bf-link-editor
  .input-group{margin:0 15px 8px}.bf-link-editor .input-group
  input{background-color:hsla(0,0%,100%,.07);border:none;border-radius:2px;box-shadow:inset 0 0 0 1px
  hsla(0,0%,100%,.1);color:#fff;font-weight:700}.bf-link-editor .input-group
  input:hover{box-shadow:inset 0 0 0 1px rgba(52,152,219,.5)}.bf-link-editor .input-group
  input:focus{box-shadow:inset 0 0 0 1px #3498db}.bf-link-editor .input-group
  input:disabled{color:hsla(0,0%,100%,.7);box-shadow:none}.bf-link-editor
  .switch-group{height:16px;margin:15px}.bf-link-editor .switch-group
  .bf-switch{float:left}.bf-link-editor .switch-group
  label{float:left;margin-left:15px;color:#999;font-size:12px;line-height:16px}.bf-link-editor
  .buttons{box-sizing:content-box;height:32px;margin-top:20px;padding:15px;overflow:hidden;box-shadow:inset
  0 1px 0 0 hsla(0,0%,100%,.1)}.bf-link-editor .buttons
  .button-remove-link{color:#999;font-size:12px;line-height:32px;cursor:pointer}.bf-link-editor
  .buttons .button-remove-link:hover{color:#e74c3c}.bf-link-editor .buttons .button-remove-link
  i{margin-right:5px;font-size:16px}.bf-link-editor .buttons .button-remove-link i,.bf-link-editor
  .buttons .button-remove-link span{display:block;float:left;line-height:32px}.bf-link-editor .buttons
  button{margin-left:10px;border-radius:2px;font-weight:700;cursor:pointer}.bf-dropdown{position:relative;width:auto;height:36px;margin:0}.bf-dropdown.disabled{pointer-events:none;opacity:.3}.bf-dropdown.light-theme
  .dropdown-content{border:1px solid #ccc}.bf-dropdown.light-theme .dropdown-content
  .dropdown-arrow{background-color:#fff;border:1px solid #ccc}.bf-dropdown.light-theme
  .dropdown-content .dropdown-content-inner{background-color:#fff}.bf-dropdown
  .dropdown-content{box-sizing:content-box;position:absolute;z-index:10;top:100%;left:50%;visibility:hidden;float:left;width:auto;min-width:100%;margin-top:9px;border-radius:2px;box-shadow:0
  5px 15px
  rgba(0,0,0,.2);opacity:0;cursor:default;transform:translate(-50%,20px);transition:.2s}.bf-dropdown
  .dropdown-content ::-webkit-scrollbar-track{background-color:transparent}.bf-dropdown
  .dropdown-content
  ::-webkit-scrollbar{width:4px;background-color:transparent;border-radius:2px}.bf-dropdown
  .dropdown-content
  ::-webkit-scrollbar-thumb{background-color:hsla(0,0%,100%,.3);border-radius:2px}.bf-dropdown
  .dropdown-content
  .dropdown-arrow{position:absolute;z-index:1;top:-3px;left:50%;width:10px;height:10px;background-color:#21242a;transform:translateX(-50%)
  rotate(45deg);transition:margin .2s}.bf-dropdown .dropdown-content
  .dropdown-arrow.active{background-color:#3498db}.bf-dropdown .dropdown-content
  .menu{list-style:none;margin:0;padding:0;overflow:hidden;border-radius:2px}.bf-dropdown
  .dropdown-content
  .menu-item{display:block;list-style:none;margin:0;font-size:16px;cursor:pointer}.bf-dropdown
  .dropdown-content .menu-item:hover{background-color:rgba(0,0,0,.1)}.bf-dropdown .dropdown-content
  .menu-item.active{background-color:#3498db;color:#fff}.bf-dropdown .dropdown-content
  .menu-item:not(.active){color:hsla(0,0%,100%,.6);box-shadow:inset 0 -1px 0 0
  hsla(0,0%,100%,.1)}.bf-dropdown
  .dropdown-content-inner{position:relative;z-index:2;overflow:auto;background-color:#21242a;border-radius:2px}.bf-dropdown
  .dropdown-handler{position:relative;display:block;width:100%;height:36px;background-color:transparent;border:none;color:#6a6f7b;cursor:pointer}.bf-dropdown
  .dropdown-handler:hover{background-color:rgba(0,0,0,.05)}.bf-dropdown .dropdown-handler
  *{display:inline;padding:0;font-size:inherit;font-weight:400}.bf-dropdown
  .dropdown-handler>span{float:left;padding:0
  10px;font-size:14px;line-height:36px;pointer-events:none}.bf-dropdown .dropdown-handler>span
  i{display:block;height:36px;font-size:16px;line-height:36px;text-align:center}.bf-dropdown
  .dropdown-handler
  .bfi-drop-down{float:right;width:30px;height:36px;font-size:16px;line-height:36px;text-align:center;pointer-events:none}.bf-dropdown.active
  .dropdown-handler{background-color:rgba(0,0,0,.05)}.bf-dropdown.active
  .dropdown-content{visibility:visible;opacity:1;transform:translate(-50%)}.headings-dropdown{min-width:110px}.headings-dropdown
  .menu{width:200px;overflow:hidden}.headings-dropdown .menu .menu-item{padding:15px
  20px;text-align:left;line-height:normal}.headings-dropdown .menu .menu-item h1,.headings-dropdown
  .menu .menu-item h2,.headings-dropdown .menu .menu-item h3,.headings-dropdown .menu .menu-item
  h4,.headings-dropdown .menu .menu-item h5,.headings-dropdown .menu .menu-item
  h6{margin:0;padding:0;color:inherit}.headings-dropdown .menu .menu-item
  h1{font-size:28px}.headings-dropdown .menu .menu-item h2{font-size:24px}.headings-dropdown .menu
  .menu-item h3{font-size:20px}.headings-dropdown .menu .menu-item
  h4{font-size:16px}.headings-dropdown .menu .menu-item h5{font-size:14px}.headings-dropdown .menu
  .menu-item
  h6{font-size:12px}.bf-colors{box-sizing:content-box;list-style:none;width:240px;margin:0;padding:15px;overflow:hidden}.bf-colors
  li{box-sizing:content-box;display:block;float:left;width:24px;height:24px;margin:5px;padding:0;background-color:currentColor;border:3px
  solid transparent;border-radius:50%;cursor:pointer;transition:transform .2s}.bf-colors
  li:hover{transform:scale(1.3)}.bf-colors li.active{box-shadow:0 0 0 2px
  #3498db}.bf-font-size-dropdown{min-width:95px}.bf-font-sizes{box-sizing:content-box;width:210px;list-style:none;margin:0;padding:5px;overflow:hidden}.bf-font-sizes
  li{display:block;float:left;width:60px;height:30px;background-color:hsla(0,0%,100%,.1);border-radius:2px;margin:5px;color:#fff;font-size:12px;line-height:30px;text-align:center;text-transform:uppercase;cursor:pointer}.bf-font-sizes
  li:hover{background-color:hsla(0,0%,100%,.2)}.bf-font-sizes
  li.active{background-color:#3498db}.text-color-dropdown.light-theme .bf-color-switch-buttons
  button{border-bottom:1px solid #ccc;color:#616569}.text-color-dropdown.light-theme
  .bf-color-switch-buttons
  button.active{border-bottom-color:#3498db;color:#3498db}.text-color-dropdown button.dropdown-handler
  span{width:36px;padding:0;overflow:hidden;border-radius:2px}.text-color-dropdown
  .bf-text-color-picker-wrap{overflow:hidden}.text-color-dropdown
  .bf-color-switch-buttons{height:36px}.text-color-dropdown .bf-color-switch-buttons
  button{float:left;width:50%;height:36px;background-color:transparent;border:none;border-bottom:1px
  solid
  hsla(0,0%,100%,.1);color:hsla(0,0%,100%,.5);font-size:12px;font-weight:400;text-transform:uppercase;cursor:pointer}.text-color-dropdown
  .bf-color-switch-buttons
  button.active{border-bottom-color:#3498db;color:#3498db}.font-family-dropdown{min-width:120px}.font-family-dropdown
  .dropdown-content{width:180px}.font-family-dropdown .menu-item{padding:12px
  15px}.bf-line-height-dropdown{min-width:95px}.bf-line-heights{box-sizing:content-box;width:210px;list-style:none;margin:0;padding:5px;overflow:hidden}.bf-line-heights
  li{display:block;float:left;width:60px;height:30px;background-color:hsla(0,0%,100%,.1);border-radius:2px;margin:5px;color:#fff;font-size:12px;line-height:30px;text-align:center;text-transform:uppercase;cursor:pointer}.bf-line-heights
  li:hover{background-color:hsla(0,0%,100%,.2)}.bf-line-heights
  li.active{background-color:#3498db}.bf-letter-spacing-dropdown{min-width:95px}.bf-letter-spacings{box-sizing:content-box;width:210px;list-style:none;margin:0;padding:5px;overflow:hidden}.bf-letter-spacings
  li{display:block;float:left;width:60px;height:30px;background-color:hsla(0,0%,100%,.1);border-radius:2px;margin:5px;color:#fff;font-size:12px;line-height:30px;text-align:center;text-transform:uppercase;cursor:pointer}.bf-letter-spacings
  li:hover{background-color:hsla(0,0%,100%,.2)}.bf-letter-spacings
  li.active{background-color:#3498db}.bf-emojis-wrap{position:relative;width:210px;height:220px;overflow:hidden}.bf-emojis-wrap:after,.bf-emojis-wrap:before{position:absolute;z-index:1;right:0;left:0;height:30px;border-radius:2px;content:"";pointer-events:none}.bf-emojis-wrap:before{top:0;background-image:linear-gradient(0deg,rgba(33,36,42,0),#21242a)}.bf-emojis-wrap:after{bottom:0;background-image:linear-gradient(rgba(33,36,42,0),#21242a)}.bf-emojis{box-sizing:content-box;width:200px;height:195px;list-style:none;margin:0;padding:15px
  15px 20px;overflow:auto}.bf-emojis
  li{display:block;float:left;width:30px;height:30px;margin:0;padding:0;color:#fff;border-radius:2px;font-family:Apple
  Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI
  Symbol;font-size:18px;line-height:32px;text-align:center;cursor:pointer;user-select:none;transition:transform
  .2s}.bf-emojis li:hover{transform:scale(1.5)}.bf-controlbar{margin:0;padding:0 5px;box-shadow:inset
  0 -1px 0 0 rgba(0,0,0,.2)}.bf-controlbar:after{display:block;content:"";clear:both}.bf-controlbar
  button{padding:0;outline:none}.bf-controlbar
  button[disabled]{pointer-events:none;opacity:.3}.bf-controlbar
  [data-title]{position:relative}.bf-controlbar [data-title]:after,.bf-controlbar
  [data-title]:before{position:absolute;z-index:10;top:100%;left:50%;pointer-events:none;opacity:0;transform:translateX(-50%)
  translateY(-5px);transition:opacity .3s,transform .3s}.bf-controlbar
  [data-title]:before{margin-top:3px;border:5px solid
  transparent;border-bottom-color:#21242a;content:""}.bf-controlbar
  [data-title]:after{margin-top:12px;padding:5px;background-color:#21242a;border-radius:2px;box-shadow:0
  5px 15px
  rgba(0,0,0,.2);color:#fff;font-size:12px;line-height:16px;white-space:nowrap;content:attr(data-title)}.bf-controlbar
  [data-title]:hover:after,.bf-controlbar
  [data-title]:hover:before{opacity:1;transform:translateX(-50%) translateY(0)}.bf-controlbar
  input{outline:none}.bf-controlbar
  .separator-line{display:block;float:left;height:26px;width:1px;margin:10px;box-shadow:inset -1px 0 0
  0 rgba(0,0,0,.1)}.bf-controlbar .separator-line+.control-item,.bf-controlbar
  .separator-line+.control-item-group{margin-left:0}.bf-controlbar
  .separator-line+.separator-line,.bf-controlbar .separator-line.first-child,.bf-controlbar
  .separator-line.last-child{display:none}.bf-controlbar
  .control-item-group{float:left;height:36px;margin:5px 0 5px 3px}.bf-controlbar
  .control-item-group:first-child{margin-left:0}.bf-controlbar
  .control-item-group>.control-item{margin-top:0;margin-bottom:0}.bf-controlbar
  .dropdown-handler{border-radius:2px}.bf-controlbar
  .control-item{display:block;float:left;height:36px;margin:5px 0 5px
  3px;border-radius:2px;cursor:pointer}.bf-controlbar
  .control-item.component-wrapper{cursor:default}.bf-controlbar
  .control-item:first-child{margin-left:0}.bf-controlbar
  .control-item.button{box-sizing:border-box;min-width:36px;padding:0
  8px;background-color:transparent;border:none;color:#6a6f7b;font-size:14px}.bf-controlbar
  .control-item.button:hover{background-color:rgba(0,0,0,.05)}.bf-controlbar
  .control-item.button.active{color:#3498db}.bf-controlbar .control-item.button
  i:before{display:block;height:36px;font-size:18px;line-height:36px}.bf-controlbar
  .control-item.button .bfi-redo:before,.bf-controlbar .control-item.button
  .bfi-undo:before{font-size:14px}.bf-controlbar .dropdown
  .control-item{width:100%;float:none;margin:0}
</style>`
export default str
