from flask import Flask
app = Flask(__name__)

#calcul du temps de trajet
@app.route("/tempsTrajet/<km>/<capacite>/<conso>/<recharge>/<vitesse>")
def tempsTrajet(km, capacite,conso,recharge, vitesse):
    km=float(km)
    capacite=float(capacite)
    conso=float(conso)
    recharge=float(recharge)
    vitesse=float(vitesse)
    
    nbRecharge = (km/capacite)*conso
    return str((km/vitesse)*60 + int(nbRecharge)*(((capacite/recharge)*60)%60))
 
        