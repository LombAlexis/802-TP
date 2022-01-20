from zeep import Client

client = Client('http://127.0.0.1:8080/?wsdl')
result = client.service.say_hello('Baub', 2)

print(result)

result = client.service.addition(1, 2)

print(result)

result = client.service.getCars()

print(result)

result = client.service.getInfo("Tesla Model 3")

print(result)