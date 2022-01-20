class Car:
    def __init__(self, name, autonomy):
        self.name = name
        self.autonomy = autonomy

    def __str__(self):
     return self.name + " " + self.autonomy

    @staticmethod
    def getCarsName():
        names = []
        cars = Car.loadCars()
        for car in cars:
            names.append(car.name)
        return names;

    @staticmethod
    def loadCars():
        cars = []
        cars.append(Car("Voiture", 400))
        
        return cars;