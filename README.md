# Cute Modal

Cute Modal is a web component that provides
- a modal confirmation dialog, or a single button modal acknowledgement for error, information, success or warnings.
- a toast notification for errors, informations, success, or warnings with varying time displays.
- a loading modal for ajax calls.

This component is appreciatively based on cuteAlert.js, [Cute Alert js](https://github.com/gustavosmanc/cute-alert), by Gustavo Mancuzo. The stylesheet and images were copied from this project.

## Installation

- Clone this repository into your project's lib folder.
- Set the web component, cute-modal, in your html followed by the source script.

``` html

<cute-modal></cute-modal>
<script src="./cute-modal.js"></script>
```

There is only one attribute, **media-path**, which should be the location of the css and img directories included. This is optional if cute-modal.js is a sibling of these folders.

## Usage

There are 3 functions exported from the javascript file:
- cuteModal display a one or two button confirmation modal. The two button modal has a type of **question**
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
## What I learned
I learned the following:
1. How to build a web component that uses a mode = 'closed'. The secret is to save the returned value of the function attachShadow in a variable. This is the shadowRoot that can be referenced through the class to access child components.
2. The web component life cycle. They are:
  - constructor() where you can attachShadow and add Event Listeners for the web component.
  - connectedCallback() where you can get/set attributes. I set the external style here and toast container.
  - disconnectedCallback() -- clean up resources. Not used.
  - attributeChangedCallback(attrName, oldVal, newVal) when an attribute changes. Not used. There were not observable attributes.
  - adoptedCallback() -- when component is adopted in the DOM. Not used.
3. Interact with the web component through events. Add Event listeners and build custom events to dispatch.
4. Load an external style sheet.
5. Distinguish between different events and the **once** option on the addEventListener function.
6. Returning a promise that waits for a specific event before resolving.
7. The use of private variables and functions in class definitions.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
