import * as NodeRsa from 'node-rsa'

const rsaPublicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD0JCTNK4kvF4CzJB8CpdFDsyQL
tKSYuc8a34iWB2HtFGVsYT/TUohKDvjvbosyNQduq6+u1ort7ue7md5kh1nij20m
uSA81InvIjpqshAG3erB86U/+0P+Wtif3W6taFqhzrr9AWHWU2nJUYeEk07tbawd
jp1gAJze4BH9ZJmziwIDAQAB
-----END PUBLIC KEY-----
`

const rsaPrivateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQD0JCTNK4kvF4CzJB8CpdFDsyQLtKSYuc8a34iWB2HtFGVsYT/T
UohKDvjvbosyNQduq6+u1ort7ue7md5kh1nij20muSA81InvIjpqshAG3erB86U/
+0P+Wtif3W6taFqhzrr9AWHWU2nJUYeEk07tbawdjp1gAJze4BH9ZJmziwIDAQAB
AoGBAL/Cs/VDQNlwSHJs6L6Xp6rZRnK7TJ15NKcS9KGC4vPolVFvgUZnCQ3CfNzz
ovmolVHkIHXfpfgFMpcz4G5tsbatxGVPW9A/wM4R0vDt0n9sUibR7XeHkz44qn/J
fF2zUsCnwH3SQ/Dv5L7o1HkLFJcleaghPA7/OSFf+zj59VKBAkEA/7ZEht/85kCR
DldyMudO2cJIwCqANy3taN6R60gfWGnglraFyW/1kz26wgy7pPQmzcZK9sJ2eWEd
F8uLdb1tGwJBAPRqiiwJ8cY3okv6q08Z2kwfTqFTbwkzI/aRhAeI2WC5A+08Hiow
rvCkdC9NGg5Vg1tc+OmDlPKiQuuua3ZHalECQF4Ahxh95t5OBgUbqGOGHLp4bX4X
IaMnQws2JrYzgTJjWaiN2IjAm6pRGwKS47gz+L/UkWI9AoiEZsmEjfPuetkCQCv7
M+viyjfh8Pl9HPB59Xc3Nv3+tn9QTYtj+f8lGAC4qkU5STBMXF5/KU0Nsb+ckauS
GlRi0h2rJyGj3ECHb1ECQAURMIvwgG8Y4Kd+9AOYbR/PmmRTFk5sItE7X2dzBOzp
/CuD6ZlmEOnPpcUwHyA7QRp0+7NI/qvD1pKgwLLy4KM=
-----END RSA PRIVATE KEY-----`
const encryptor = new NodeRsa()
encryptor.setOptions({ encryptionScheme: 'pkcs1' })
encryptor.importKey(rsaPublicKey)
encryptor.importKey(rsaPrivateKey)

export default encryptor
