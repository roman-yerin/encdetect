const ngram = require('n-gram')
const fs = require('fs')

var chunk_size = 1024*4
var fh = fs.openSync(process.argv[2], 'r')
var buffer = Buffer.allocUnsafe(chunk_size)
var offset = 0
var prev = ""
var words = {}
var ngrams = {}
while (fs.readSync(fh, buffer, 0, chunk_size, offset) == chunk_size){
	var s = buffer.toString()
	if (prev) s = prev + s
	var parts = s.split(/\s+/)
	prev = parts[-1]
	offset = offset + chunk_size
	parts.splice(-1,1)
	parts.forEach(function callback(currentValue, index, array) {
		currentValue = currentValue.toLowerCase()
			.replace(/\./g,'')
			.replace(/,/g,'')
			.replace(/!/g,'')
			.replace(/\?/g,'')
			.replace(/:/g,'')
			.replace(/;/g,'')
			.replace(/-/g,'')
			.replace(/"/g,'')
			.replace(/\'/g,'')
			.replace(/\(/g,'')
			.replace(/\)/g,'')
			.replace(/[^а-яё]+/g,'')
		if (/^[0-9]+$/.test(currentValue)) return
		if (/[a-z]+/.test(currentValue)) return
		if (currentValue == '') return
		var n = ngram.bigram(' ' + currentValue + ' ')
		for (var i = 0; i < n.length; i++) {
			ngrams[n[i]] = ngrams[n[i]]?ngrams[n[i]]+1:1
		}
    	words[currentValue] = words[currentValue]?words[currentValue]+1:1
	});
}
var sortable = [];
for (var bigram in ngrams) {
    sortable.push([bigram, ngrams[bigram]])
}

sortable.sort(function(a, b) {
    return b[1] - a[1]
});

console.log(JSON.stringify(ngrams))
