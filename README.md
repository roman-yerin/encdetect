# encdetect
Encoding detection module (javascript)
```javascript
const encdetect = require('encdetect')
var buffer = ... // Get Buffer data
encdetect(buffer)
```
Returns Object instance { encoding: 'encoding', confidence: 0 to 1 }
