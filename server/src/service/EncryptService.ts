import * as NodeRsa from 'node-rsa'

const rsaPublicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoeDJDgLgDDrxqbw5sOMkpwwQx
LUrHD8U6rXi0Ze1skshLITqc9BdN3PT0FLt2tEnPTrHczqO9z3yJlRGUiQOWITWQ
KWKDanyARppYQ58+2WNtUxmy8XfYqAo59j0W0H257ty8xPSlsvK0HVyeUXuwTJ6/
n1Ma4EY0B3QkGMm9mwIDAQAB
-----END PUBLIC KEY-----
`

const rsaPrivateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCoeDJDgLgDDrxqbw5sOMkpwwQxLUrHD8U6rXi0Ze1skshLITqc
9BdN3PT0FLt2tEnPTrHczqO9z3yJlRGUiQOWITWQKWKDanyARppYQ58+2WNtUxmy
8XfYqAo59j0W0H257ty8xPSlsvK0HVyeUXuwTJ6/n1Ma4EY0B3QkGMm9mwIDAQAB
AoGAf5l6SJJnzTkOEHdJL0LbalwhArZRWvBg7A6Ty98fswqB1hW29UYTmI/woCZL
zp7DANeT87A3aP6MTxCvHhegtIgcIBH/ZBtwkCyBA3ydEX4daCTZdsMxWMwyrejq
BYRFQg9CuKEkVVomXX8J7LDpcmyHKkTjjRU+LCasQUD5GkECQQD19VqW7pSmw1lv
ae2WLmQQE4D117xZQDIb+DF6ciyIXbFhrO3K40kIv9OxhZNk5gTJYKzSfsSo9XJ1
hEc4yYNxAkEAr1j2rCuN1U5q3EIA1yvRZNe0UsUIrD94Gj2HkqPXR9UTLuq4qrjr
3xAbkZWblU0WyRMw8xuu/Yv5z8gcQz8zywJAeRQNQlu0ZduovUYCJXo03A0d4OgQ
2kbV5BrsEIEAFyk4VwMQFF6K53m3Np6xDmyFUrT6nqy1Fw+tBtjVTsk0oQJAfF94
z9QwzSzLBSHX4MdWxdVuNQtGxI5cTRh5khyedXgAHFYm2AlEXLrbIx9f9L1yPPtc
zANF0te3QJcq3NP2kwJBAMJ9nZcmqjELGzhjBHR+8nBc+qeGr0oaAg+TrQCP3IfL
v1X03qRjJB2MroZR1eeCeI+AkO7gPPYrej2QoRuQKUw=
-----END RSA PRIVATE KEY-----
`
const encryptor = new NodeRsa()
encryptor.setOptions({ encryptionScheme: 'pkcs1' })
encryptor.importKey(rsaPublicKey)
encryptor.importKey(rsaPrivateKey)

export default encryptor
