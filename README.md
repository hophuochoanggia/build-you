Convert file to base64
openssl base64 < PATH

https://reactnative.dev/docs/signed-apk-android

keytool -genkeypair -v -storetype PKCS12 -keystore KEY_PATH -alias KEY_ALIAS -keyalg RSA -keysize 2048 -validity 10000

Get Key SHA-1
keytool -list -v -keystore PATH -alias KEY_STORE_ALIAS -storepass PASS -keypass PASS

Android SHA-1:
Debug: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
Staging: 89:AC:42:39:AD:0D:DE:68:75:D2:DD:9B:86:90:3E:93:2E:67:77:AA
Production: 01:04:38:73:c1:4e:ac:07:0c:3c:18:25:d1:46:83:63:91:00:6f:6f