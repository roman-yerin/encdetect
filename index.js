const ngram = require('n-gram')
const rus = require('./rus.json')
const iconv = require('iconv-lite')

module.exports = function (buf) {
	var res = {}
	var ascii = true
	for (var i = 0; i<buf.length; i++) if(buf[i] > 127) ascii = false
	if (ascii) return {encoding:'ascii', confidence:1}

	for (var cp of ['windows-1251','utf-8','utf16-le','koi8-r']){
		var str = iconv.decode(buf, cp).toLowerCase()
		var ngrams = ngram.bigram(str)
		for(var n of ngrams){
			if (rus[n])	res[cp] = res[cp]?res[cp]+rus[n]:rus[n]
		}
		res[cp] = res[cp]?res[cp]:0
	}
	var max = 0
	var max_cp = ''
	var sum = 0
	for (var cp in res){
		sum = sum + res[cp]
		if (res[cp]>max) { max = res[cp]; max_cp = cp; }
	}
	return {encoding:max_cp,confidence:Math.ceil(max/sum*100)/100}
}