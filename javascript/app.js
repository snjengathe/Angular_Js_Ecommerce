var GuitarWebsiteApp = angular.module('GuitarWebsiteApp',['ngRoute']);

GuitarWebsiteApp.config(function($routeProvider){
	//Register
	$routeProvider.when('/', {
		templateUrl: 'templates/inventory.html',
		controller: 'inventoryCtrl'
	});
	//Customer Info
	$routeProvider.when('/customerInfo', {
		templateUrl: 'templates/customerInfo.html',
		controller: 'customerInfoCtrl'
	});
	//Confirmation
	//Customer Info
	$routeProvider.when('/confirmation', {
		templateUrl: 'templates/confirmation.html',
		controller: 'confirmationCtrl'
	});
});

GuitarWebsiteApp.controller('inventoryCtrl',function($scope, $location, $http, theGuitarStoreSvc){
	//On Page Load Have the Previous Button Disables and show First Picture
	$scope.index = theGuitarStoreSvc.setIndex(0);
	$scope.prevDisable = true;

	//Getting Guitar Data from json file
	$http.get('../json/guitardata.json').success(function(resp){
		$scope.guitarData = resp.allProducts;
	});

	//Next Button Function
	$scope.goNext = function(){
		$scope.index++;
		theGuitarStoreSvc.increment();
		dis_enable($scope.index)
	};

	//Previous Button Function
	$scope.goPrev = function(){
		$scope.index--;
		theGuitarStoreSvc.decrement();
		dis_enable($scope.index)
	}

	//Enable Disable Function
	function dis_enable(count){
		switch (count){
			case 0:
				$scope.prevDisable = true;
				break;
			case 1:
				$scope.prevDisable = false;
				break;
			case 5:
				$scope.nextDisable = false;
				break;
			case 6:
				$scope.nextDisable = true;
				break;
		}
	}

	//Add to Cart Button Function
	$scope.addCart = function(){
		$location.path('/customerInfo')
	}
});

GuitarWebsiteApp.controller('customerInfoCtrl', function($scope, $http, theGuitarStoreSvc, $filter, $location){
	$scope.index = theGuitarStoreSvc.getIndex();
	//On Page Load Hide Review and Buy div
	$scope.reviewAndBuy = true;
	//Getting Guitar Data from json file
	$http.get('../json/guitardata.json').success(function(resp){
		$scope.guitarData = resp.allProducts;
	})
	.then(function(){
		//Total Cost
		$scope.total = function(index){
		var guitarCost = parseInt($scope.guitarData[index].price);
		var shippingCost = parseInt($filter('getShippingCost')($scope.guitarData[index].shipping_details));
		var total = guitarCost + shippingCost;
		//Storing Total Cost To Service
		theGuitarStoreSvc.totalCost = total;
		
		return total;
		}
	});

	//Review Order Button Function
	$scope.reviewOrder = function(){
		//Check if User Entered All Fields
		if($scope.fName != null && $scope.lName != null && $scope.email != null && $scope.phoneFirst3 != null
			&& $scope.phoneSecond3 != null && $scope.phoneLast4 != null && $scope.address != null &&
			$scope.city != null && $scope.state != null && $scope.zipcode != null){
				
			// Hide Shipping Info and Show Review and Buy
			$scope.reviewAndBuy = false;
			$scope.shippingInfo = true;

			//Store all User Shipping Info in Service
			theGuitarStoreSvc.fName = $scope.fName;
			theGuitarStoreSvc.lName = $scope.lName;
			theGuitarStoreSvc.email = $scope.email;
			theGuitarStoreSvc.phoneFirst3 = $scope.phoneFirst3;
			theGuitarStoreSvc.phoneSecond3 = $scope.phoneSecond3;
			theGuitarStoreSvc.phoneLast4 = $scope.phoneLast4;
			theGuitarStoreSvc.address = $scope.address;
			theGuitarStoreSvc.city = $scope.city;
			theGuitarStoreSvc.state = $scope.state;
			theGuitarStoreSvc.zipcode = $scope.zipcode;
		}
		else{
			alert("Please Enter all Fields")
		}
	}

	//Edit Button Function
	$scope.edit = function(){
		$scope.reviewAndBuy = true;
		$scope.shippingInfo = false;
	}

	//Buy Button Function
	$scope.buy = function(){
		$location.path('/confirmation');
	}
});

GuitarWebsiteApp.controller('confirmationCtrl', function($scope, theGuitarStoreSvc, $http){
	$scope.index = theGuitarStoreSvc.getIndex();
	//Getting Guitar Data from json file
	$http.get('../json/guitardata.json').success(function(resp){
		$scope.guitarData = resp.allProducts;
	});
	//Storing User Name and Address From Service
	$scope.fName = theGuitarStoreSvc.fName;
	$scope.lName = theGuitarStoreSvc.lName;
	$scope.address = theGuitarStoreSvc.address;
	$scope.city = theGuitarStoreSvc.city;
	$scope.state = theGuitarStoreSvc.state;
	$scope.zipcode = theGuitarStoreSvc.zipcode;
	$scope.total = theGuitarStoreSvc.totalCost;
});

//Custom Filter to Get Shipping Cost from String of Text
GuitarWebsiteApp.filter("getShippingCost", function(){
	return function(text){
		text = text || "";
		var textArray = text.split("");
		return textArray.slice(-2).join("");
	};
});

//Service
GuitarWebsiteApp.service("theGuitarStoreSvc", function(){
	var index = 0;
	this.increment = function(){
		index++;
	}
	this.decrement = function(){
		index--;
	}
	this.getIndex = function(){
		return index;
	}
	this.setIndex = function(newIndex){
		index = newIndex;
		return index;
	}
});



