angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("/plugins/taskpoints/taskpoints.html","\n<div contrib-task-points=\"contrib-task-points\" ng-controller=\"ContribTaskPointsAdminController as ctrl\" class=\"task-points\">\n  <header>\n    <h1><span class=\"project-name\">{{::project.name}}</span><span class=\"green\">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <fieldset>\n      <label for=\"ep_name\">Estimated Points custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"ep_name\" ng-model=\"settings.ep_name\" placeholder=\"Estimated Points\" id=\"ep_name\"/>\n        </fieldset>\n      </div>\n      <label for=\"rp_name\">Real Points custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"rp_name\" ng-model=\"settings.rp_name\" placeholder=\"Real Points\" id=\"rp_name\"/>\n        </fieldset>\n      </div>\n      <label for=\"tt_name\">Task Type custom name</label>\n      <div class=\"contrib-form-wrapper\">\n        <fieldset class=\"contrib-input\">\n          <input type=\"text\" name=\"tt_name\" ng-model=\"settings.tt_name\" placeholder=\"Type\" id=\"tt_name\"/>\n        </fieldset>\n      </div>\n    </fieldset>\n    <input type=\"submit\" title=\"settings.active ? \'Deactivate Plugin\' : \'Activate Plugin\'\" ng-class=\"{\'button-green\': !settings.active, \'button-red\': settings.active}\" ng-value=\"settings.active ? \'Deactivate Plugin\' : \'Activate Plugin\'\" class=\"submit-button\"/>\n  </form>\n</div>\n<div contrib-userstory-table=\"contrib-userstory-table\" ng-controller=\"ContribUserstoryTableAdminController as ctrl\" class=\"userstory-table\">\n  <header>\n    <h1><span class=\"green\">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <fieldset>\n      <label>Select Sprint</label>\n      <div class=\"contrib-form-wrapper\">\n        <select ng-options=\"milestone as milestone.name for milestone in milestones track by milestone.id\" ng-model=\"selected\" ng-change=\"changeSprint()\" class=\"select-sprint\"></select>\n      </div>\n    </fieldset>\n    <div ng-hide=\"userstories.length &lt; 1\" class=\"basic-table\">\n      <div class=\"table-header row\">\n        <div>Userstory</div>\n        <div ng-repeat=\"role in roles | orderBy: id\">{{ role.name }}</div>\n        <div>Total</div>\n      </div>\n      <div ng-repeat=\"userstory in userstories\" class=\"table-body row\">\n        <div>{{ userstory.subject }}              </div>\n        <div ng-repeat=\"point in userstory.points_value | orderBy: key\">{{ point.value }}</div>\n        <div>{{ userstory.total_points }}</div>\n      </div>\n      <div class=\"table-footer row\">\n        <div>Total</div>\n        <div ng-repeat=\"total in column_totals | orderBy: key\">{{ total.value }}</div>\n        <div>{{ total_points }}</div>\n      </div>\n    </div>\n  </form>\n  <header class=\"sub-header\">\n    <h1><span class=\"green\">Burndown</span></h1>\n  </header>\n  <div class=\"task-burndown\">\n    <section class=\"burndown-container\">\n      <div class=\"burndown\"></div>\n    </section>\n  </div>\n</div>");
$templateCache.put("/plugins/taskpoints/userstory-table.html","\n<div contrib-userstory-table=\"contrib-userstory-table\" ng-controller=\"ContribUserstoryTableAdminController as ctrl\" class=\"userstory-table\">\n  <header>\n    <h1><span class=\"green\">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <fieldset>\n      <label>Select Sprint</label>\n      <div class=\"contrib-form-wrapper\">\n        <select ng-options=\"milestone as milestone.name for milestone in milestones track by milestone.id\" ng-model=\"selected\" ng-change=\"changeSprint()\" class=\"select-sprint\"></select>\n      </div>\n    </fieldset>\n    <div ng-hide=\"userstories.length &lt; 1\" class=\"basic-table\">\n      <div class=\"table-header row\">\n        <div>Userstory</div>\n        <div ng-repeat=\"role in roles | orderBy: id\">{{ role.name }}</div>\n        <div>Total</div>\n      </div>\n      <div ng-repeat=\"userstory in userstories\" class=\"table-body row\">\n        <div>{{ userstory.subject }}              </div>\n        <div ng-repeat=\"point in userstory.points_value | orderBy: key\">{{ point.value }}</div>\n        <div>{{ userstory.total_points }}</div>\n      </div>\n      <div class=\"table-footer row\">\n        <div>Total</div>\n        <div ng-repeat=\"total in column_totals | orderBy: key\">{{ total.value }}</div>\n        <div>{{ total_points }}</div>\n      </div>\n    </div>\n  </form>\n  <header class=\"sub-header\">\n    <h1><span class=\"green\">Burndown</span></h1>\n  </header>\n  <div class=\"task-burndown\">\n    <section class=\"burndown-container\">\n      <div class=\"burndown\"></div>\n    </section>\n  </div>\n</div>");}]);

/*
 *  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
 *
 *  Copyright 2016 by Sopra Steria
 *  Copyright 2016 by David Peris <david.peris92@gmail.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  var moduleName;

  moduleName = 'taigaContrib.taskpoints';

  angular.module(moduleName, []);

}).call(this);


/*
 *  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
 *
 *  Copyright 2016 by Sopra Steria
 *  Copyright 2016 by David Peris <david.peris92@gmail.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  var TaskPointsAdmin, TaskPointsDirective, debounce, initTaskPointsPlugin, module;

  module = angular.module('taigaContrib.taskpoints');

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

    return TaskPointsAdmin;

  })();

  TaskPointsDirective = function($repo, $confirm, $loading, $http, $urls, service) {
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
          $scope.settings.active = !$scope.settings.active;
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
              service.activate($scope.settings);
            } else if ($scope.settings.id) {
              service.deactivate($scope.settings);
            }
            currentLoading.finish();
            return $confirm.notify("success");
          });
          promise.then(null, function(data) {
            currentLoading.finish();
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
          return $scope.settings.active;
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

  module.controller("ContribTaskPointsAdminController", TaskPointsAdmin);

  module.directive("contribTaskPoints", ["$tgRepo", "$tgConfirm", "$tgLoading", "$tgHttp", "$tgUrls", "activationService", TaskPointsDirective]);

  initTaskPointsPlugin = function($tgUrls) {
    return $tgUrls.update({
      "taskpoints": "/taskpoints",
      "taskpoints_settings": "/taskpoints_settings"
    });
  };

  module.run(["$tgUrls", initTaskPointsPlugin]);

}).call(this);


/*
 *  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
 *
 *  Copyright 2016 by Sopra Steria
 *  Copyright 2016 by David Peris <david.peris92@gmail.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  var UserstoryTableAdmin, debounce, module;

  module = angular.module('taigaContrib.taskpoints');

  debounce = function(wait, func) {
    return _.debounce(func, wait, {
      leading: true,
      trailing: false
    });
  };

  UserstoryTableAdmin = (function() {
    UserstoryTableAdmin.$inject = ["$rootScope", "$scope", "$tgRepo", "tgAppMetaService", "$tgConfirm", "$tgHttp", "tableService", "chartService"];

    function UserstoryTableAdmin(rootScope, scope, repo, appMetaService, confirm, http, tableService, chartService) {
      this.rootScope = rootScope;
      this.scope = scope;
      this.repo = repo;
      this.appMetaService = appMetaService;
      this.confirm = confirm;
      this.http = http;
      this.tableService = tableService;
      this.chartService = chartService;
      this.scope.sectionName = "User Stories table";
      this.scope.sectionSlug = "user stories table";
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
            _this.scope.selected = _this.tableService.get_present_milestone(project_milestones);
            _this.tableService.get_table(_this.scope);
            return _this.chartService.get_settings(_this.scope.projectId).then(function(settings) {
              var burndown;
              if (settings != null) {
                burndown = $('.userstory-table .task-burndown');
                if (settings.active) {
                  return _this.chartService.startDraw(burndown, _this.scope.selected, settings);
                }
              }
            });
          });
        };
      })(this));
    }

    return UserstoryTableAdmin;

  })();

  module.controller("ContribUserstoryTableAdminController", UserstoryTableAdmin);

}).call(this);


/*
 *  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
 *
 *  Copyright 2016 by Sopra Steria
 *  Copyright 2016 by David Peris <david.peris92@gmail.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  var UserstoryTableDirective, debounce, initUserstoryTablePlugin, module;

  module = angular.module('taigaContrib.taskpoints');

  debounce = function(wait, func) {
    return _.debounce(func, wait, {
      leading: true,
      trailing: false
    });
  };

  UserstoryTableDirective = function($repo, $confirm, $loading, $urls, table_service, chart_service) {
    var link;
    link = function($scope, $el, $attrs) {
      var burndown, select;
      $scope.changeSprint = (function(_this) {
        return function() {
          if ($scope.selected != null) {
            table_service.get_table($scope);
            return chart_service.get_settings($scope.projectId).then(function(settings) {
              if (settings.active) {
                return chart_service.startDraw(burndown, $scope.selected, settings);
              }
            });
          }
        };
      })(this);
      select = $el.find(".select-sprint");
      return burndown = $el.find('.task-burndown');
    };
    return {
      link: link
    };
  };

  UserstoryTableDirective.$inject = ["$tgRepo", "$tgConfirm", "$tgLoading", "$tgUrls", "tableService", "chartService"];

  module.directive("contribUserstoryTable", UserstoryTableDirective);

  initUserstoryTablePlugin = function($tgUrls) {
    return $tgUrls.update({
      "userstory_table": "/userstory_table"
    });
  };

  module.run(["$tgUrls", initUserstoryTablePlugin]);

}).call(this);


/*
 *  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
 *
 *  Copyright 2016 by Sopra Steria
 *  Copyright 2016 by David Peris <david.peris92@gmail.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  var ActivationService;

  ActivationService = (function() {
    ActivationService.$inject = ["$tgRepo", "$tgHttp"];

    function ActivationService(repo, http) {
      this.repo = repo;
      this.http = http;
    }

    ActivationService.prototype.activate = function(settings) {
      return this.http.post(this.repo.resolveUrlForModel(settings) + '/activate');
    };

    ActivationService.prototype.deactivate = function(settings) {
      return this.http.post(this.repo.resolveUrlForModel(settings) + '/deactivate');
    };

    return ActivationService;

  })();

  angular.module('taigaContrib.taskpoints').service("activationService", ActivationService);

}).call(this);


/*
 *  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
 *
 *  Copyright 2016 by Sopra Steria
 *  Copyright 2016 by David Peris <david.peris92@gmail.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  var ChartService;

  ChartService = (function() {
    ChartService.$inject = ["$tgHttp", "$tgRepo", "$translate"];

    function ChartService(http, repo, translate) {
      this.http = http;
      this.repo = repo;
      this.translate = translate;
    }

    ChartService.prototype.startDraw = function(element, milestone, settings1) {
      this.settings = settings1;
      return this.get_stats_taskpoints(milestone.id).then((function(_this) {
        return function(stats) {
          _this.stats = stats.data;
          if (_this.stats) {
            return _this.redrawChart(element, _this.stats.days);
          }
        };
      })(this));
    };

    ChartService.prototype.get_settings = function(project_id) {
      return this.repo.queryMany("taskpoints_settings", {
        project: project_id
      }).then((function(_this) {
        return function(task_points_settings) {
          var settings;
          settings = {
            project: project_id,
            active: false
          };
          if (task_points_settings.length > 0) {
            return settings = task_points_settings[0];
          }
        };
      })(this));
    };

    ChartService.prototype.get_stats_taskpoints = function(milestone_id) {
      return this.http.get(this.repo.resolveUrlForModel(this.settings) + '/get_stats_taskpoints?milestone=' + milestone_id);
    };

    ChartService.prototype.redrawChart = function(element, dataToDraw) {
      var data, days, options, width;
      width = element.width();
      element.height(240);
      days = _.map(dataToDraw, function(x) {
        return moment(x.day);
      });
      data = [];
      data.unshift({
        data: _.zip(days, _.map(dataToDraw, function(d) {
          return d.optimal_points;
        })),
        lines: {
          fillColor: "rgba(120,120,120,0.2)"
        }
      });
      data.unshift({
        data: _.zip(days, _.map(dataToDraw, function(d) {
          return d.open_points;
        })),
        lines: {
          fillColor: "rgba(102,153,51,0.3)"
        }
      });
      options = {
        grid: {
          borderWidth: {
            top: 0,
            right: 1,
            left: 0,
            bottom: 0
          },
          borderColor: '#ccc',
          hoverable: true
        },
        xaxis: {
          tickSize: [1, "day"],
          min: days[0],
          max: _.last(days),
          mode: "time",
          daysNames: days,
          axisLabel: this.translate.instant("TASKBOARD.CHARTS.XAXIS_LABEL"),
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 10
        },
        yaxis: {
          min: 0,
          axisLabel: this.translate.instant("TASKBOARD.CHARTS.YAXIS_LABEL"),
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5
        },
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            fill: true
          },
          points: {
            show: true,
            fill: true,
            radius: 4,
            lineWidth: 2
          }
        },
        colors: ["rgba(102,153,51,1)", "rgba(120,120,120,0.2)"],
        tooltip: true,
        tooltipOpts: {
          content: (function(_this) {
            return function(label, xval, yval, flotItem) {
              var formattedDate, roundedValue;
              formattedDate = moment(xval).format(_this.translate.instant("TASKBOARD.CHARTS.DATE"));
              roundedValue = Math.round(yval);
              if (flotItem.seriesIndex === 1) {
                return _this.translate.instant("TASKBOARD.CHARTS.OPTIMAL", {
                  formattedDate: formattedDate,
                  roundedValue: roundedValue
                });
              } else {
                return _this.translate.instant("TASKBOARD.CHARTS.REAL", {
                  formattedDate: formattedDate,
                  roundedValue: roundedValue
                });
              }
            };
          })(this)
        }
      };
      element.empty();
      return element.plot(data, options).data("plot");
    };

    return ChartService;

  })();

  angular.module('taigaContrib.taskpoints').service("chartService", ChartService);

}).call(this);


/*
 *  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
 *
 *  Copyright 2016 by Sopra Steria
 *  Copyright 2016 by David Peris <david.peris92@gmail.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  var TableService;

  TableService = (function() {
    TableService.$inject = ["$tgRepo"];

    function TableService(repo) {
      this.repo = repo;
    }

    TableService.prototype.get_table = function(scope) {
      this.scope = scope;
      return this.repo.queryMany("roles", {
        project: this.scope.projectId
      }).then((function(_this) {
        return function(roles_data) {
          _this.scope.roles = roles_data;
          return _this.repo.queryMany("userstories", {
            milestone: _this.scope.selected.id
          });
        };
      })(this)).then((function(_this) {
        return function(us_data) {
          _this.scope.userstories = us_data;
          return _this.repo.queryMany("points", {
            project: _this.scope.projectId
          });
        };
      })(this)).then((function(_this) {
        return function(points_data) {
          var i, index, j, l, len, len1, len2, missing_role, point, point_id, point_key, points, points_map, ref, ref1, ref2, role, total_points, userstory;
          points_map = _this.map_values(points_data);
          total_points = 0;
          ref = _this.scope.userstories;
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
            ref2 = _this.scope.roles;
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
            _this.scope.userstories[index].points_value = points;
          }
          _this.remove_unused_fields(_this.scope.userstories, _this.scope.roles);
          _this.scope.column_totals = _this.get_column_total_points(_this.scope.userstories);
          return _this.scope.total_points = total_points;
        };
      })(this)).then(null, function(data) {
        return null;
      });
    };

    TableService.prototype.map_values = function(array) {
      var i, len, map, row;
      map = [];
      for (i = 0, len = array.length; i < len; i++) {
        row = array[i];
        map[row.id] = row.value;
      }
      return map;
    };

    TableService.prototype.remove_unused_fields = function(userstories, roles) {
      var i, j, k, key, l, len, len1, len2, m, n, o, p, point, points, points_key, r, ref, ref1, ref2, ref3, remove_key, results, story_index, userstory;
      points_key = roles.map(function(rol) {
        return rol.id.toString();
      });
      for (r = i = ref = roles.length - 1; ref <= 0 ? i <= 0 : i >= 0; r = ref <= 0 ? ++i : --i) {
        if ((roles[r] != null) && !roles[r].computable) {
          roles.splice(r, 1);
        }
      }
      for (k = j = ref1 = points_key.length - 1; ref1 <= 0 ? j <= 0 : j >= 0; k = ref1 <= 0 ? ++j : --j) {
        if (!(points_key[k] != null)) {
          continue;
        }
        remove_key = false;
        for (story_index = l = 0, len = userstories.length; l < len; story_index = ++l) {
          userstory = userstories[story_index];
          ref2 = userstory.points_value;
          for (m = 0, len1 = ref2.length; m < len1; m++) {
            point = ref2[m];
            if (point.key === points_key[k] && (point.value != null) && point.value > 0) {
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
          if ((roles[r] != null) && roles[r].id === parseInt(key)) {
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
                if ((points[p] != null) && points[p].key === key) {
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

    TableService.prototype.get_column_total_points = function(userstories) {
      var i, j, l, len, len1, len2, m, point, ref, ref1, ref2, t, total, totals, u, value;
      totals = [];
      ref = userstories[0].points_value;
      for (i = 0, len = ref.length; i < len; i++) {
        point = ref[i];
        if (point.value != null) {
          value = point.value;
        } else {
          value = 0;
        }
        totals.push({
          key: point.key,
          value: value
        });
      }
      if (userstories.length > 1) {
        for (u = j = 1, ref1 = userstories.length - 1; 1 <= ref1 ? j <= ref1 : j >= ref1; u = 1 <= ref1 ? ++j : --j) {
          ref2 = userstories[u].points_value;
          for (l = 0, len1 = ref2.length; l < len1; l++) {
            point = ref2[l];
            for (t = m = 0, len2 = totals.length; m < len2; t = ++m) {
              total = totals[t];
              if (total.key === point.key && (point.value != null)) {
                totals[t].value += point.value;
              }
            }
          }
        }
      }
      return totals;
    };

    TableService.prototype.get_present_milestone = function(milestones) {
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

    TableService.prototype.get_formatted_date = function(date_string) {
      var date, day, month, year;
      date = date_string.split('-');
      year = parseInt(date[0]);
      month = parseInt(date[1]) - 1;
      day = parseInt(date[2]);
      return new Date(year, month, day);
    };

    return TableService;

  })();

  angular.module('taigaContrib.taskpoints').service("tableService", TableService);

}).call(this);
