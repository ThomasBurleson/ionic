
IonicModule
.directive('ionNavBar', tapScrollToTopDirective())
.directive('ionHeaderBar', tapScrollToTopDirective())

/**
 * @ngdoc directive
 * @name ionHeaderBar
 * @module ionic
 * @restrict E
 *
 * @description
 * Adds a fixed header bar above some content.
 *
 * Can also be a subheader (lower down) if the 'bar-subheader' class is applied.
 * See [the header CSS docs](/docs/components/#subheader).
 *
 * Note: If you use ionHeaderBar in combination with ng-if, the surrounding content
 * will not align correctly.  This will be fixed soon.
 *
 * @param {string=} align-title Where to align the title.
 * Avaialble: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-header-bar align-title="left" class="bar-positive">
 *   <div class="buttons">
 *     <button class="button" ng-click="doSomething()">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-header-bar>
 * <ion-content>
 *   Some content!
 * </ion-content>
 * ```
 */
/**
 * @ngdoc demo
 * @name ionHeaderBar#simple
 * @module headerBarSimple
 * @javascript
 * angular.module('headerBarSimple', ['ionic'])
 * .controller('HeaderBarSimpleCtrl', function($scope) {
 *   $scope.data = {
 *     isSubheader: false,
 *     isShown: true
 *   };
 *   $scope.items = [];
 *   for (var i = 0; i < 20; i++) {
 *     $scope.items.push('Item ' + i);
 *   }
 * });
 *
 * @html
 * <div ng-controller="HeaderBarSimpleCtrl">
 *   <ion-header-bar class="bar-positive"
 *     ng-class="{'bar-subheader': data.isSubheader}"
 *     ng-show="data.isShown">
 *     <h1 class="title">Tap Me to Scroll Top</h1>
 *   </ion-header-bar>
 *   <ion-content>
 *     <ion-toggle ng-model="data.isSubheader">
 *       Make it a Subheader?
 *     </ion-toggle>
 *     <ion-toggle ng-model="data.isShown">
 *       Show it?
 *     </ion-toggle>
 *     <div class="list">
 *       <div class="item" ng-repeat="item in items">
 *         {{item}}
 *       </div>
 *     </div>
 *   </ion-content>
 * </div>
 */
.directive('ionHeaderBar', headerFooterBarDirective(true))

/**
 * @ngdoc directive
 * @name ionFooterBar
 * @module ionic
 * @restrict E
 *
 * @description
 * Adds a fixed footer bar below some content.
 *
 * Can also be a subfooter (higher up) if the 'bar-subfooter' class is applied.
 * See [the footer CSS docs](/docs/components/#footer).
 *
 * Note: If you use ionFooterBar in combination with ng-if, the surrounding content
 * will not align correctly.  This will be fixed soon.
 *
 * @param {string=} align-title Where to align the title.
 * Avaialble: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Some content!
 * </ion-content>
 * <ion-footer-bar align-title="left" class="bar-assertive">
 *   <div class="buttons">
 *     <button class="button">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons" ng-click="doSomething()">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-footer-bar>
 * ```
 */
/**
 * @ngdoc demo
 * @name ionFooterBar#simple
 * @module footerBarSimple
 * @javascript
 * angular.module('footerBarSimple', ['ionic'])
 * .controller('FooterBarSimpleCtrl', function($scope) {
 *   $scope.data = {
 *     isSubfooter: false,
 *     isShown: true
 *   };
 *
 *   $scope.items = [];
 *   for (var i = 0; i < 20; i++) {
 *     $scope.items.push('Item ' + i);
 *   }
 * });
 *
 * @html
 * <div ng-controller="FooterBarSimpleCtrl">
 *   <ion-footer-bar class="bar-assertive"
 *       ng-class="{'bar-subfooter': data.isSubfooter}"
 *       ng-show="data.isShown">
 *     <h1 class="title">Footer</h1>
 *   </ion-footer-bar>
 *   <ion-content>
 *     <ion-toggle ng-model="data.isSubfooter">
 *       Make it a Subfooter?
 *     </ion-toggle>
 *     <ion-toggle ng-model="data.isShown">
 *       Show it?
 *     </ion-toggle>
 *     <div class="list">
 *       <div class="item" ng-repeat="item in items">
 *         {{item}}
 *       </div>
 *     </div>
 *   </ion-content>
 * </div>
 */
.directive('ionFooterBar', headerFooterBarDirective(false));

function tapScrollToTopDirective() {
  return ['$ionicScrollDelegate', function($ionicScrollDelegate) {
    return {
      restrict: 'E',
      link: function($scope, $element, $attr) {
        ionic.on('tap', onTap, $element[0]);
        $scope.$on('$destroy', function() {
          ionic.off('tap', onTap, $element[0]);
        });

        function onTap(e) {
          var depth = 3;
          var current = e.target;
          //Don't scroll to top in certain cases
          while (depth-- && current) {
            if (current.classList.contains('button') ||
                current.tagName.match(/input|textarea|select/i) ||
                current.isContentEditable) {
              return;
            }
            current = current.parentNode;
          }
          var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
          var bounds = $element[0].getBoundingClientRect();
          if (ionic.DomUtil.rectContains(
            touch.pageX, touch.pageY,
            bounds.left, bounds.top - 20,
            bounds.left + bounds.width, bounds.top + bounds.height
          )) {
            var scrollCtrl = $element.controller('$ionicScroll');
            scrollCtrl && scrollCtrl.scrollTop(true);
          }
        }
      }
    };
  }];
}

function headerFooterBarDirective(isHeader) {
  return [function() {
    return {
      restrict: 'E',
      compile: function($element, $attr) {
        $element.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');

        return { pre: prelink };
        function prelink($scope, $element, $attr) {
          var hb = new ionic.views.HeaderBar({
            el: $element[0],
            alignTitle: $attr.alignTitle || 'center'
          });

          var el = $element[0];

          if (isHeader) {
            $scope.$watch(function() { return el.className; }, function(value) {
              var isShown = value.indexOf('ng-hide') === -1;
              var isSubheader = value.indexOf('bar-subheader') !== -1;
              $scope.$hasHeader = isShown && !isSubheader;
              $scope.$hasSubheader = isShown && isSubheader;
            });
            $scope.$on('$destroy', function() {
              delete $scope.$hasHeader;
              delete $scope.$hasSubheader;
            });
          } else {
            $scope.$watch(function() { return el.className; }, function(value) {
              var isShown = value.indexOf('ng-hide') === -1;
              var isSubfooter = value.indexOf('bar-subfooter') !== -1;
              $scope.$hasFooter = isShown && !isSubfooter;
              $scope.$hasSubfooter = isShown && isSubfooter;
            });
            $scope.$on('$destroy', function() {
              delete $scope.$hasFooter;
              delete $scope.$hasSubfooter;
            });
            $scope.$watch('$hasTabs', function(val) {
              $element.toggleClass('has-tabs', !!val);
            });
          }
        }
      }
    };
  }];
}
