/**
 * Created by Andrew on 2/23/2018.
 */
function columnVisibility($datatable) {
    $datatable.columns().every(function () {
        var index = this.index();
        // console.log(data);
        //second parameter is for resizing
        this.visible(getCookie('columnVisibility-' + index) !== 'false', false);
    });

    $datatable.columns.adjust(); // adjust column sizing and redraw
    $datatable.on('column-visibility.dt', function (e, settings, column, state) {
        setCookie('columnVisibility-' + column, state);
        // console.log(
        //     'Column ' + column + ' has changed to ' + (state ? 'visible' : 'hidden')
        // );
    });
}