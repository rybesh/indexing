function tokenize() {
  var $this = $(this), tokens
  tokens = $this.text().split(/\.?\,?\s+|\.$/).slice(0,-1)
  $this.html('<span>' + tokens.join('</span> <span>') + '</span>')
}

function conflate() {
  var $this = $(this)
  $this.text($this.text().toLowerCase())
}

var stopwords = ["a","about","above","after","again","against","all","am","an","and","any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours ","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"]
function remove_stopwords() {
  var $this = $(this)
  if (stopwords.indexOf($this.text().toLowerCase()) >= 0) {
    $this.remove()
  }
}

function stem() {
  var $this = $(this)
  $this.text(stemmer($this.text()))
}

function document_statistics() {
  var $this
    , token
    , doc_idx
    , index = {}
    , lengths = [0,0,0]
  $('span').each(function() {
    $this = $(this)
    token = $this.text()
    if (! (token in index)) {
      index[token] = [0,0,0]
    }
    doc_idx = parseInt($this.parent().attr('id').split('-')[1], 10)
    index[token][doc_idx] += 1
    lengths[doc_idx] += 1
  })
  return [index,lengths]
}

function update_display(index, lengths) {
  var rows, tfs, df, idf
  rows = '<thead><tr>'
    + '<th>token</th><th>n</th>'
    + '<th>n(doc1)</th><th>n(doc2)</th><th>n(doc3)</th><th>tf(doc1)</th>'
    + '<th>tf(doc2)</th><th>tf(doc3)</th><th>idf</th>'
    + '<th>tf*idf(doc1)</th><th>tf*idf(doc2)</th><th>tf*idf(doc3)</th>'
    + '</tr></thead>'
    + '<tbody>'
  for (token in index) {
    tfs = index[token].map(function (v,i) { return v/lengths[i] })
    df = index[token].reduce(function(acc,n) { return n > 0 ? acc+1 : acc }, 0)
    idf = Math.log(tfs.length/df) + 1
    rows += ('<tr><td>' 
      + token 
      + '</td><td>' 
      + index[token].reduce(function(a,b) { return a+b })
      + '</td><td>' 
      + index[token].join('</td><td>') 
      + '</td><td>' 
      + tfs.map(function (v) { return v.toFixed(2) }).join('</td><td>') 
      + '</td><td>' 
      + idf.toFixed(2)
      + '</td><td>' 
      + tfs.map(function (v) { return (v*idf).toFixed(2) }).join('</td><td>') 
      + '</td></tr>')
  }
  rows += '</tbody>'
  $('table').html(rows).tablesorter()
}

function update_index() {
  var statistics = document_statistics()
  update_display(statistics[0], statistics[1])
}

function handle_tokenize_button_click(e) {
  $(e.target).attr('disabled','disabled')
  $('#conflate').removeAttr('disabled')
  $('#stopwords').removeAttr('disabled')
  $('#stem').removeAttr('disabled')
  $('p').each(tokenize)
  update_index()
}

function handle_conflate_button_click(e) {
  $('span').each(conflate)
  update_index()
}

function handle_stopwords_button_click(e) {
  $('span').each(remove_stopwords)
  update_index()
}

function handle_stem_button_click(e) {
  $('span').each(stem)
  update_index()  
}

$('#tokenize').click(handle_tokenize_button_click)
$('#conflate').click(handle_conflate_button_click)
$('#stopwords').click(handle_stopwords_button_click)
$('#stem').click(handle_stem_button_click)

