"use strict";
exports.__esModule = true;
var NodeRsa = require("node-rsa");
var rsaPublicKey = "\n-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoeDJDgLgDDrxqbw5sOMkpwwQx\nLUrHD8U6rXi0Ze1skshLITqc9BdN3PT0FLt2tEnPTrHczqO9z3yJlRGUiQOWITWQ\nKWKDanyARppYQ58+2WNtUxmy8XfYqAo59j0W0H257ty8xPSlsvK0HVyeUXuwTJ6/\nn1Ma4EY0B3QkGMm9mwIDAQAB\n-----END PUBLIC KEY-----\n";
var rsaPrivateKey = "\n-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCoeDJDgLgDDrxqbw5sOMkpwwQxLUrHD8U6rXi0Ze1skshLITqc\n9BdN3PT0FLt2tEnPTrHczqO9z3yJlRGUiQOWITWQKWKDanyARppYQ58+2WNtUxmy\n8XfYqAo59j0W0H257ty8xPSlsvK0HVyeUXuwTJ6/n1Ma4EY0B3QkGMm9mwIDAQAB\nAoGAf5l6SJJnzTkOEHdJL0LbalwhArZRWvBg7A6Ty98fswqB1hW29UYTmI/woCZL\nzp7DANeT87A3aP6MTxCvHhegtIgcIBH/ZBtwkCyBA3ydEX4daCTZdsMxWMwyrejq\nBYRFQg9CuKEkVVomXX8J7LDpcmyHKkTjjRU+LCasQUD5GkECQQD19VqW7pSmw1lv\nae2WLmQQE4D117xZQDIb+DF6ciyIXbFhrO3K40kIv9OxhZNk5gTJYKzSfsSo9XJ1\nhEc4yYNxAkEAr1j2rCuN1U5q3EIA1yvRZNe0UsUIrD94Gj2HkqPXR9UTLuq4qrjr\n3xAbkZWblU0WyRMw8xuu/Yv5z8gcQz8zywJAeRQNQlu0ZduovUYCJXo03A0d4OgQ\n2kbV5BrsEIEAFyk4VwMQFF6K53m3Np6xDmyFUrT6nqy1Fw+tBtjVTsk0oQJAfF94\nz9QwzSzLBSHX4MdWxdVuNQtGxI5cTRh5khyedXgAHFYm2AlEXLrbIx9f9L1yPPtc\nzANF0te3QJcq3NP2kwJBAMJ9nZcmqjELGzhjBHR+8nBc+qeGr0oaAg+TrQCP3IfL\nv1X03qRjJB2MroZR1eeCeI+AkO7gPPYrej2QoRuQKUw=\n-----END RSA PRIVATE KEY-----\n";
var encryptor = new NodeRsa();
encryptor.setOptions({ encryptionScheme: 'pkcs1' });
encryptor.importKey(rsaPublicKey);
encryptor.importKey(rsaPrivateKey);
exports["default"] = encryptor;
