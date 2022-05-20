# Cute Modal

Cute Modal is a web component that provides
- a modal confirmation dialog, or a single button modal acknowledgement for error, information, success or warnings.
- a toast notification for errors, informations, success, or warnings with varying time displays.
- a loading modal for ajax calls.

This component is based on cuteAlert.js, [Cute Alert js](https://github.com/gustavosmanc/cute-alert), by Gustavo Mancuzo. The stylesheet and images were copied from this project.

## Installation

- Clone this repository into your project's lib folder.
- Set the web component, cute-modal, in your html.

``` html

<cute-modal></cute-modal>
<script src="./cute-modal.js"></script>
```

There is only one attribute, **media-path**, which should be the location of the css and img directories included. This is optional if cute-modal.js is a sibling of these folders.

## Usage

There are 3 functions exported from the javascript file:
- cuteModal display a one or two button confirmation modal
- cuteToast display a toast timed message
- cuteLoadWait display/hide a modal ajax load.

### cuteModal

```javascript

// confirmation dialog
cuteModal({
  type: 'question',
  title: '',
  message: '',
  confirmText: 'Yes',
  cancelText: 'Cancel',
  buttonText: 'Okay',  
  closeStyle: 'circle',
  buttons: 'columns',
  payload: {}
});
```
#### Configuration Object

| Field | Description |
| --------------- | ----------------------------------- |
| type | error, info, question, success, warning *default info* |
| title | title of dialog (first line, bolded) *default 'Default Title'* |
| message | text to display *default 'This is my message to you'* |
| confirmText | confirm button text if question type *default 'Yes'*|
| cancelText | cancel button text if question type *default 'No'* |
| buttonText | button text for all other types *default 'Okay'* |
| closeStyle | 'circle' or blank *default 'circle'* |
| buttons | rows (1 each row), columns (side by side) how question type buttons are displayed *default 'columns'* |
| payload | object to return on question type confirm event dispatch *default {}*|

### cuteModal

```javascript
cuteToast('Info Notification!','info',8000);
```
#### Arguments
1. message - the toast message
2. type - 'error','info', 'success', 'warning' *default 'info'*
3. timer - time to display the toast (1000 = 1 second) *default 5000*

The toast returns a promise, so it's possible to perform an action after the expiration of the timer.

```javascript
cuteToast('Info Notification!','info',8000).then((data) => console.log(data.message));
```

### cuteLoadWait
```javascript
cuteLoadWait(true) --- turn on the modal wait
cuteLoadWait(false) --- turn off the modal wait
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
