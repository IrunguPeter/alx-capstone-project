#Python Code goes in here.. I will install the dependencies in a virtual evironment"
import pypartpicker

pcpp = pypartpicker.Client()
part = pcpp.get_part("https://pcpartpicker.com/b/Fzhkcf")

for spec, value in part.specs.items():
    print(f"{spec}: {value}")

print(part.cheapest_price)