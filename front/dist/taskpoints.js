
/*
 * Copyright (C) 2014-2016 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2016 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2016 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2016 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2016 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2016 Xavi Julian <xavier.julian@kaleidos.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: slack.coffee
 */

(function() {
  var TaskPointsAdmin, TaskPointsDirective, debounce, initTaskPointsPlugin, module;

  debounce = function(wait, func) {
    return _.debounce(func, wait, {
      leading: true,
      trailing: false
    });
  };

  TaskPointsAdmin = (function() {
    TaskPointsAdmin.$inject = ["$rootScope", "$scope", "$tgRepo", "tgAppMetaService", "$tgConfirm", "$tgHttp", "$tgUrls"];

    function TaskPointsAdmin(rootScope, scope, repo, appMetaService, confirm, http) {
      this.rootScope = rootScope;
      this.scope = scope;
      this.repo = repo;
      this.appMetaService = appMetaService;
      this.confirm = confirm;
      this.http = http;
      this.scope.sectionName = "Task points";
      this.scope.sectionSlug = "task points";
      this.scope.$on("project:loaded", (function(_this) {
        return function() {
          var promise;
          promise = _this.repo.queryMany("taskpoints_settings", {
            project: _this.scope.projectId
          });
          return promise.then(function(task_points_settings) {
            _this.scope.settings = {
              project: _this.scope.projectId,
              active: false
            };
            if (task_points_settings.length > 0) {
              return _this.scope.settings = task_points_settings[0];
            }
          });
        };
      })(this));
    }

    TaskPointsAdmin.prototype.activate = function(http, repo, scope) {
      this.http = http;
      this.repo = repo;
      this.scope = scope;
      return this.http.post(this.repo.resolveUrlForModel(this.scope.settings) + '/activate');
    };

    TaskPointsAdmin.prototype.deactivate = function(http, repo, scope) {
      this.http = http;
      this.repo = repo;
      this.scope = scope;
      return this.http.post(this.repo.resolveUrlForModel(this.scope.settings) + '/deactivate');
    };

    return TaskPointsAdmin;

  })();

  TaskPointsDirective = function($repo, $confirm, $loading, $http, $urls) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var currentLoading, promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          currentLoading = $loading().target(submitButton).start();
          if (!$scope.settings.id) {
            promise = $repo.create("taskpoints_settings", $scope.settings);
            promise.then(function(data) {
              return $scope.settings = data;
            });
          } else {
            promise = $repo.save($scope.settings);
            promise.then(function(data) {
              return $scope.settings = data;
            });
          }
          promise.then(function(data) {
            if ($scope.settings.active) {
              TaskPointsAdmin.prototype.activate($http, $repo, $scope);
            } else if ($scope.settings.id) {
              TaskPointsAdmin.prototype.deactivate($http, $repo, $scope);
            }
            currentLoading.finish();
            return $confirm.notify("success");
          });
          return promise.then(null, function(data) {
            currentLoading.finish();
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $el.on("click", ".submit-button", submit);
    };
    return {
      link: link
    };
  };

  module = angular.module('taigaContrib.taskpoints', []);

  module.controller("ContribTaskPointsAdminController", TaskPointsAdmin);

  module.directive("contribTaskPoints", ["$tgRepo", "$tgConfirm", "$tgLoading", "$tgHttp", "$tgUrls", TaskPointsDirective]);

  initTaskPointsPlugin = function($tgUrls) {
    return $tgUrls.update({
      "taskpoints": "/taskpoints",
      "taskpoints_settings": "/taskpoints_settings"
    });
  };

  module.run(["$tgUrls", initTaskPointsPlugin]);

}).call(this);

angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("/plugins/taskpoints/taskpoints.html","\n<div contrib-task-points=\"contrib-task-points\" ng-controller=\"ContribTaskPointsAdminController as ctrl\">\n  <header>\n    <h1><span class=\"project-name\">{{::project.name}}</span><span class=\"green\">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <fieldset>\n      <div class=\"check-item\"><span>Activate Plugin</span>\n        <div class=\"check\">\n          <input type=\"checkbox\" name=\"active\" ng-model=\"settings.active\"/>\n          <div></div><span translate=\"COMMON.YES\" class=\"check-text check-yes\"></span><span translate=\"COMMON.NO\" class=\"check-text check-no\"></span>\n        </div>\n      </div>\n      <label for=\"ep_name\">Estimated Points custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"ep_name\" ng-model=\"settings.ep_name\" placeholder=\"Estimated Points\" id=\"ep_name\"/>\n        </fieldset>\n      </div>\n      <label for=\"rp_name\">Real Points custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"rp_name\" ng-model=\"settings.rp_name\" placeholder=\"Real Points\" id=\"rp_name\"/>\n        </fieldset>\n      </div>\n      <label for=\"tt_name\">Task Type custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"tt_name\" ng-model=\"settings.tt_name\" placeholder=\"Type\" id=\"tt_name\"/>\n        </fieldset>\n      </div>\n    </fieldset>\n    <button type=\"submit\" title=\"{{\'COMMON.SAVE\' | translate}}\" translate=\"COMMON.SAVE\" class=\"button-green submit-button\"></button>\n    <tg-svg svg-icon=\"icon-question\"></tg-svg><span>Do you need help? Check out our support page!</span>\n  </form>\n</div>");}]);