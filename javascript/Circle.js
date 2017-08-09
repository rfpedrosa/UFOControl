(function(window) {

/**
* Represents a circle as defined by the points (x, y) and radius.
* @class Rectangle
* @constructor
* @param {Number} x X position. Default is 0.
* @param {Number} y Y position. Default is 0.
* @param {Number} radius. Default is 0.
**/
Circle = function(x, y, radius) {
  this.initialize(x, y, radius);
}
var p = Circle.prototype;
	
// public properties:
	/** 
	* X position. 
	* @property x
	* @type Number
	**/
	p.x = 0;
	
	/** 
	* Y position. 
	* @property y
	* @type Number
	**/
	p.y = 0;
	
	/** 
	* Width.
	* @property width
	* @type Number
	**/
	p.radius = 0;
	
	
// constructor:
	/** 
	* Initialization method.
	* @method initialize
	* @protected
	*/
	p.initialize = function(x, y, radius) {
		this.x = (x == null ? 0 : x);
		this.y = (y == null ? 0 : y);
		this.radius = (radius == null ? 0 : radius);
	}
	
// public methods:
	/**
	* Returns a clone of the Rectangle instance.
	* @method clone
	* @return {Rectangle} a clone of the Rectangle instance.
	**/
	p.clone = function() {
		return new Circle(this.x, this.y, this.radius);
	}

	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[Circle (x="+this.x+" y="+this.y+" radius="+this.radius+")]";
	}
	
window.Circle = Circle;
}(window));