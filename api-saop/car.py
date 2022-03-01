#Class car
class Car:
    def __init__(self, name, autonomy, topSpeed, efficiency, fastCharge, normalCharge, capacity):
        self.name = name
        self.autonomy = autonomy
        self.topSpeed = topSpeed
        self.efficiency = efficiency
        self.fastCharge = fastCharge
        self.normalCharge = normalCharge
        self.capacity = capacity

    def __str__(self):
     return str(self.name) + " " + str(self.autonomy)

    #renvoie le nom des véhicules
    @staticmethod
    def getCarsName():
        names = []
        cars = Car.loadCars()
        for car in cars:
            names.append(car.name)
        return names;

    #renvoie les caractéristiques
    @staticmethod
    def getCarInfo(pName):
        cars = Car.loadCars()
        for car in cars:
            if (car.name == pName):
                yield car.name
                yield str(car.autonomy)
                yield str(car.topSpeed)
                yield str(car.efficiency)
                yield str(car.fastCharge)
                yield str(car.normalCharge)
                yield str(car.capacity)
                return
        yield "No cars found, check the name of the car"
        return

    #Data come from here https://ev-database.org/car/1319/Dacia-Spring-Electric
    @staticmethod
    def loadCars():
        cars = []
        cars.append(Car("Tesla Model 3",380,225,150,170000,11000,57000))
        cars.append(Car("Dacia Spring Electric",170,125,158,34000,6600,26800))
        cars.append(Car("Kia EV6 GT",395,260,196,233000,11000,77400))
        cars.append(Car("BMW i4 eDrive40",475,190,170,200000,11000,80700))
        cars.append(Car("Voiture",475,190,170,200000,11000,80700))
        
        return cars;