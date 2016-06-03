
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

  module = angular.module('taigaContrib.taskpoints', ['taigaContrib.userstoryTable']);

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


/*
 * Copyright (C) 2016 David Peris <david.peris92@gmail.com>
 * Copyright (C) 2016 Sopra Steria
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
 * File: userstory-table.coffee
 */

(function() {
  var UserstoryTableAdmin, UserstoryTableDirective, debounce, initUserstoryTablePlugin, module;

  debounce = function(wait, func) {
    return _.debounce(func, wait, {
      leading: true,
      trailing: false
    });
  };

  UserstoryTableAdmin = (function() {
    UserstoryTableAdmin.$inject = ["$rootScope", "$scope", "$tgRepo", "tgAppMetaService", "$tgConfirm", "$tgHttp", "$tgUrls"];

    function UserstoryTableAdmin(rootScope, scope, repo, appMetaService, confirm, http) {
      this.rootScope = rootScope;
      this.scope = scope;
      this.repo = repo;
      this.appMetaService = appMetaService;
      this.confirm = confirm;
      this.http = http;
      this.scope.sectionName = "Userstory table";
      this.scope.sectionSlug = "userstory table";
      this.scope.userstories = [];
      this.scope.roles = [];
      this.scope.$on("project:loaded", (function(_this) {
        return function() {
          var promise;
          promise = _this.repo.queryMany("milestones", {
            project: _this.scope.projectId
          });
          return promise.then(function(project_milestones) {
            _this.scope.milestones = project_milestones;
            return _this.scope.selected = _this.get_present_milestone(project_milestones);
          });
        };
      })(this));
    }

    UserstoryTableAdmin.prototype.get_table = function(repo, $scope) {
      this.repo = repo;
      return this.repo.queryMany("roles", {
        project: $scope.projectId
      }).then((function(_this) {
        return function(roles_data) {
          $scope.roles = roles_data;
          return _this.repo.queryMany("userstories", {
            milestone: $scope.selected.id
          });
        };
      })(this)).then((function(_this) {
        return function(us_data) {
          $scope.userstories = us_data;
          return _this.repo.queryMany("points", {
            project: $scope.projectId
          });
        };
      })(this)).then((function(_this) {
        return function(points_data) {
          var i, index, j, l, len, len1, len2, missing_role, point, point_id, point_key, points, points_map, ref, ref1, ref2, role, total_points, userstory;
          points_map = _this.map_values(points_data);
          total_points = 0;
          ref = $scope.userstories;
          for (index = i = 0, len = ref.length; i < len; index = ++i) {
            userstory = ref[index];
            points = [];
            total_points += userstory.total_points;
            ref1 = userstory.points;
            for (point_key in ref1) {
              point_id = ref1[point_key];
              points.push({
                key: point_key,
                value: points_map[point_id]
              });
            }
            ref2 = $scope.roles;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              role = ref2[j];
              missing_role = true;
              for (l = 0, len2 = points.length; l < len2; l++) {
                point = points[l];
                if (role.id.toString() === point.key) {
                  missing_role = false;
                }
              }
              if (missing_role) {
                points.push({
                  key: role.id.toString(),
                  value: null
                });
              }
            }
            $scope.userstories[index].points_value = points;
          }
          _this.remove_unused_fields($scope.userstories, $scope.roles);
          $scope.column_totals = _this.get_column_total_points($scope.userstories);
          return $scope.total_points = total_points;
        };
      })(this)).then(null, function(data) {
        return null;
      });
    };

    UserstoryTableAdmin.prototype.map_values = function(array) {
      var i, len, map, row;
      map = [];
      for (i = 0, len = array.length; i < len; i++) {
        row = array[i];
        map[row.id] = row.value;
      }
      return map;
    };

    UserstoryTableAdmin.prototype.remove_unused_fields = function(userstories, roles) {
      var i, j, k, key, l, len, len1, len2, m, n, o, p, point, points, points_key, r, ref, ref1, ref2, ref3, remove_key, results, story_index, userstory;
      points_key = roles.map(function(rol) {
        return rol.id.toString();
      });
      for (r = i = ref = roles.length - 1; ref <= 0 ? i <= 0 : i >= 0; r = ref <= 0 ? ++i : --i) {
        if (roles[r] !== void 0 && roles[r].computable === false) {
          roles.splice(r, 1);
        }
      }
      for (k = j = ref1 = points_key.length - 1; ref1 <= 0 ? j <= 0 : j >= 0; k = ref1 <= 0 ? ++j : --j) {
        if (!(points_key[k] !== void 0)) {
          continue;
        }
        remove_key = false;
        for (story_index = l = 0, len = userstories.length; l < len; story_index = ++l) {
          userstory = userstories[story_index];
          ref2 = userstory.points_value;
          for (m = 0, len1 = ref2.length; m < len1; m++) {
            point = ref2[m];
            if (point.key === points_key[k] && point.value !== null) {
              remove_key = true;
            }
          }
        }
        if (remove_key) {
          points_key.splice(k, 1);
        }
      }
      results = [];
      for (n = 0, len2 = points_key.length; n < len2; n++) {
        key = points_key[n];
        for (r = o = ref3 = roles.length - 1; ref3 <= 0 ? o <= 0 : o >= 0; r = ref3 <= 0 ? ++o : --o) {
          if (roles[r] !== void 0 && roles[r].id === parseInt(key)) {
            roles.splice(r, 1);
          }
        }
        results.push((function() {
          var len3, q, results1;
          results1 = [];
          for (story_index = q = 0, len3 = userstories.length; q < len3; story_index = ++q) {
            userstory = userstories[story_index];
            points = userstory.points_value;
            results1.push((function() {
              var ref4, results2, s;
              results2 = [];
              for (p = s = ref4 = points.length - 1; ref4 <= 0 ? s <= 0 : s >= 0; p = ref4 <= 0 ? ++s : --s) {
                if (points[p] !== void 0 && points[p].key === key) {
                  results2.push(userstories[story_index].points_value.splice(p, 1));
                }
              }
              return results2;
            })());
          }
          return results1;
        })());
      }
      return results;
    };

    UserstoryTableAdmin.prototype.get_column_total_points = function(userstories) {
      var i, j, l, len, len1, len2, m, point, ref, ref1, ref2, t, total, totals, u, value;
      totals = [];
      ref = userstories[0].points_value;
      for (i = 0, len = ref.length; i < len; i++) {
        point = ref[i];
        if (point.value !== null) {
          value = point.value;
        } else {
          value = 0;
        }
        totals.push({
          key: point.key,
          value: value
        });
      }
      for (u = j = 1, ref1 = userstories.length - 1; 1 <= ref1 ? j <= ref1 : j >= ref1; u = 1 <= ref1 ? ++j : --j) {
        ref2 = userstories[u].points_value;
        for (l = 0, len1 = ref2.length; l < len1; l++) {
          point = ref2[l];
          for (t = m = 0, len2 = totals.length; m < len2; t = ++m) {
            total = totals[t];
            if (total.key === point.key && point.value !== null) {
              totals[t].value += point.value;
            }
          }
        }
      }
      return totals;
    };

    UserstoryTableAdmin.prototype.get_present_milestone = function(milestones) {
      var finish_date, i, len, milestone, start_date, today;
      today = new Date().getTime();
      for (i = 0, len = milestones.length; i < len; i++) {
        milestone = milestones[i];
        start_date = this.get_formatted_date(milestone.estimated_start).getTime();
        finish_date = this.get_formatted_date(milestone.estimated_finish).getTime();
        if (start_date <= today && today <= finish_date) {
          return milestone;
        }
      }
      return milestones[0];
    };

    UserstoryTableAdmin.prototype.get_formatted_date = function(date_string) {
      var date, day, month, year;
      date = date_string.split('-');
      year = parseInt(date[0]);
      month = parseInt(date[1]) - 1;
      day = parseInt(date[2]);
      return new Date(year, month, day);
    };

    return UserstoryTableAdmin;

  })();

  UserstoryTableDirective = function($repo, $confirm, $loading, $urls) {
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
          promise = UserstoryTableAdmin.prototype.get_table($repo, $scope);
          promise.then(function(data) {
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

  module = angular.module('taigaContrib.userstoryTable', []);

  module.controller("ContribUserstoryTableAdminController", UserstoryTableAdmin);

  module.directive("contribUserstoryTable", ["$tgRepo", "$tgConfirm", "$tgLoading", "$tgHttp", "$tgUrls", UserstoryTableDirective]);

  initUserstoryTablePlugin = function($tgUrls) {
    return $tgUrls.update({
      "userstory_table": "/userstory_table"
    });
  };

  module.run(["$tgUrls", initUserstoryTablePlugin]);

}).call(this);

angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("/plugins/taskpoints/taskpoints.html","\n<div contrib-task-points=\"contrib-task-points\" ng-controller=\"ContribTaskPointsAdminController as ctrl\">\n  <header>\n    <h1><span class=\"project-name\">{{::project.name}}</span><span class=\"green\">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <fieldset>\n      <div class=\"check-item\"><span>Activate Plugin</span>\n        <div class=\"check\">\n          <input type=\"checkbox\" name=\"active\" ng-model=\"settings.active\"/>\n          <div></div><span translate=\"COMMON.YES\" class=\"check-text check-yes\"></span><span translate=\"COMMON.NO\" class=\"check-text check-no\"></span>\n        </div>\n      </div>\n      <label for=\"ep_name\">Estimated Points custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"ep_name\" ng-model=\"settings.ep_name\" placeholder=\"Estimated Points\" id=\"ep_name\"/>\n        </fieldset>\n      </div>\n      <label for=\"rp_name\">Real Points custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"rp_name\" ng-model=\"settings.rp_name\" placeholder=\"Real Points\" id=\"rp_name\"/>\n        </fieldset>\n      </div>\n      <label for=\"tt_name\">Task Type custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"tt_name\" ng-model=\"settings.tt_name\" placeholder=\"Type\" id=\"tt_name\"/>\n        </fieldset>\n      </div>\n    </fieldset>\n    <button type=\"submit\" title=\"{{\'COMMON.SAVE\' | translate}}\" translate=\"COMMON.SAVE\" class=\"button-green submit-button\"></button>\n  </form>\n</div>\n<div contrib-userstory-table=\"contrib-userstory-table\" ng-controller=\"ContribUserstoryTableAdminController as ctrl\">\n  <header>\n    <h1><span class=\"project-name\">{{::project.name}}</span><span class=\"green\">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <fieldset>\n      <div class=\"check-item\"><span>Select Sprint</span>\n        <div class=\"contrib-form-wrapper\">\n          <select ng-options=\"milestone as milestone.name for milestone in milestones track by milestone.id\" ng-model=\"selected\"></select>\n        </div>\n      </div>\n    </fieldset>\n    <button type=\"submit\" title=\"Generate Table\" class=\"button-green submit-button\">Generate Table</button>\n    <div ng-hide=\"userstories.length &lt; 1\" class=\"basic-table userstory-table\">\n      <div class=\"table-header row\">\n        <div>Userstory</div>\n        <div ng-repeat=\"role in roles | orderBy: id\">{{ role.name }}</div>\n        <div>Total</div>\n      </div>\n      <div ng-repeat=\"userstory in userstories\" class=\"table-body row\">\n        <div>{{ userstory.subject }}              </div>\n        <div ng-repeat=\"point in userstory.points_value | orderBy: key\">{{ point.value }}</div>\n        <div>{{ userstory.total_points }}</div>\n      </div>\n      <div class=\"table-footer row\">\n        <div>Total</div>\n        <div ng-repeat=\"total in column_totals | orderBy: key\">{{ total.value }}</div>\n        <div>{{ total_points }}</div>\n      </div>\n    </div>\n  </form>\n</div>");
$templateCache.put("/plugins/taskpoints/userstory-table.html","\n<div contrib-userstory-table=\"contrib-userstory-table\" ng-controller=\"ContribUserstoryTableAdminController as ctrl\">\n  <header>\n    <h1><span class=\"project-name\">{{::project.name}}</span><span class=\"green\">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <fieldset>\n      <div class=\"check-item\"><span>Select Sprint</span>\n        <div class=\"contrib-form-wrapper\">\n          <select ng-options=\"milestone as milestone.name for milestone in milestones track by milestone.id\" ng-model=\"selected\"></select>\n        </div>\n      </div>\n    </fieldset>\n    <button type=\"submit\" title=\"Generate Table\" class=\"button-green submit-button\">Generate Table</button>\n    <div ng-hide=\"userstories.length &lt; 1\" class=\"basic-table userstory-table\">\n      <div class=\"table-header row\">\n        <div>Userstory</div>\n        <div ng-repeat=\"role in roles | orderBy: id\">{{ role.name }}</div>\n        <div>Total</div>\n      </div>\n      <div ng-repeat=\"userstory in userstories\" class=\"table-body row\">\n        <div>{{ userstory.subject }}              </div>\n        <div ng-repeat=\"point in userstory.points_value | orderBy: key\">{{ point.value }}</div>\n        <div>{{ userstory.total_points }}</div>\n      </div>\n      <div class=\"table-footer row\">\n        <div>Total</div>\n        <div ng-repeat=\"total in column_totals | orderBy: key\">{{ total.value }}</div>\n        <div>{{ total_points }}</div>\n      </div>\n    </div>\n  </form>\n</div>");}]);