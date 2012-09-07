var fs = require("fs");
var GPIO_PATH = "/sys/class/gpio/",
    EXPORT_PATH = GPIO_PATH + "export",
    UNEXPORT_PATH = GPIO_PATH + "unexport",
    OUT='out',
    IN = 'in',
    HIGH = 1,
    LOW = 0;
var GPIO = {};

GPIO.pins = {
    GPIO_NONE : -1,
    GPIO00 : 0,
    GPIO01 : 1,
    GPIO04 : 4,
    GPIO07 : 7,
    GPIO08 : 8,
    GPIO09 : 9,
    GPIO10 : 10,
    GPIO11 : 11,
    GPIO14 : 14,
    GPIO15 : 15,
    GPIO17 : 17,
    GPIO18 : 18,
    GPIO21 : 21,
    GPIO22 : 22,
    GPIO23 : 23,
    GPIO24 : 24,
    GPIO25 : 25,
    Pin03  : 0,
    Pin05  : 1,
    Pin07  : 4,
    Pin08  : 14,
    Pin10  : 15,
    Pin11  : 17,
    Pin12  : 18,
    Pin13  : 21,
    Pin15  : 22,
    Pin16  : 23,
    Pin18  : 24,
    Pin19  : 10,
    Pin21  : 9,
    Pin22  : 25,
    Pin23  : 11,
    Pin24  : 8,
    Pin26  : 7
};

var getPinPath = function(index){
    return GPIO_PATH + "gpio" + index;
}

var isPinExported = function(index){
    var pinPath = getPinPath(index);
    return fs.existsSync(pinPath);
}

var exportPin = function(gpioIndex) {
    if(gpioIndex < 0 || gpioIndex > 25) {
        throw new Error("Not support Pin");
    }
    
    var exist = isPinExported(gpioIndex);
    if(exist)
        return;
    try {
        fs.writeFileSync(EXPORT_PATH, gpioIndex);
    } catch(ex) {
        log(ex.Message);
    }

    //FOR Debug
    //fs.mkdirSync(getPinPath(gpioIndex));
}

var unexport = function(gpioIndex){
    if(gpioIndex < 0 || gpioIndex > 25) {
        throw new Error("Not support Pin");
    }
    var exist = isPinExported(gpioIndex);
    if(!exist)
        return;
    try{
        fs.writeFileSync(UNEXPORT_PATH,gpioIndex);
    } catch (ex){
        log(ex.Message);
    }

    //FOR Debug
    //var path = getPinPath(gpioIndex);
    //fs.unlinkSync(path+"/value");
    //fs.unlinkSync(path+"/direction");
    //fs.rmdirSync(getPinPath(gpioIndex));
}


function PinObj(pin,direction,value){
    if(!direction)
        direction = OUT;
    if(typeof value == 'undefined')
        value = HIGH;
    this.pin = pin;
    this.direction = direction;
    this.value = value;

    exportPin(pin);
    this.setDirection(direction);
}
PinObj.prototype.getPinPath = function() {
    return getPinPath(this.pin);
};
PinObj.prototype.setDirection = function(direction) {
    var directionPath = this.getPinPath() + "/direction";
    fs.writeFileSync(directionPath,direction);
};
PinObj.prototype.set = function(value) {
    if(this.direction == IN)
        return;
    var val = value===0?LOW:HIGH;
    var valuePath = this.getPinPath()+"/value";
    fs.writeFileSync(valuePath,val);
};
PinObj.prototype.high = function() {
    this.set(HIGH);
};
PinObj.prototype.low = function() {
    this.set(LOW);
};
PinObj.prototype.get = function() {
    if(this.direction==OUT)
        return 0;
    var valuePath = this.getPinPath()+"/value";
    return fs.readFileSync(valuePath).toString()/1;
};
PinObj.prototype.unexport = function() {
    unexport(this.pin);
};

GPIO.init = function(pin,direction,value){
    return new PinObj(pin,direction,value);
}


module.exports = GPIO;