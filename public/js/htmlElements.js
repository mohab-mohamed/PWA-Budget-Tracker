$(document).ready( function() {
    let modalOptions = {
        keyboard: true,
        focus: true,
        show: false
    }
    const $add = $("#add");
    const $formModal = $("#formModal");
    $add.click(function() {
        modalOptions.show = !modalOptions.show;
        $formModal.modal(modalOptions);
    });
})