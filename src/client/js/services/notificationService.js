angular.module('gw2Calc').factory('notificationService',
    function () {
        return {
            notifySuccess: function (msg, title) {
                toastr.success(msg, title);
            },
            notifyInfo: function (msg, title) {
                toastr.info(msg, title, this.customOptions());
            },
            notifyWarning: function (msg, title) {
                toastr.warning(msg, title, this.customOptions());
            },
            notifyError: function (msg, title) {
                toastr.error(msg, title, this.customOptions());
            },
            clear: function () {
                toastr.clear();
            },
            customOptions: function () {
                return {
                    'showDuration': '0',
                    'hideDuration': '0',
                    'timeOut': '0',
                    'extendedTimeOut': '1000',
                };
            }
        };
    }
);