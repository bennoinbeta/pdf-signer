# PDF-Signer

A simple NodeJs application, which automatically adds signs to multiple pdf documents.
Unfortunately it will never have a UI, so don't worry and just follow the steps bellow.


### Step 1

Clone this project.


### Step 2

Run `yarn install` to install all necessary dependencies.


### Step 2

Create a `file` folder with 2 sub folders called `input` and `signs` on the root of the project.
```js title="TodoList-Core"
pdf-signer
│── files
│   ├── input
│   ├── output
|   └── signs
|── src
.
```

#### `input`
Our pdf files, which get later signed by this application should be located here.

#### `signs` 
The signs which will be used to sign our in `input` located pdf files should be located here.
On Each pdf site a random sign from this folder will be put to increase the diversity a little.
We recommend using signs in the same dimensions.

#### `output`
This folder gets automatically generated after executing this program.
Here our signed pdf files will be located.


### Step 3

Edit the `drawImage` function call, until the sign is on the wished position.

```ts
page.drawImage(signImage, {
    x: page.getWidth() / 2 - signImageDims.width / 2 - 100,
    y: page.getHeight() / 2 - signImageDims.height / 2 - 250,
    width: signImageDims.width,
    height: signImageDims.height,
 });
```


### Step 4

Run `yarn run start` which automatically builds and executes this project.
If everything went right, our signed pdf files are located in the generated `output` folder.
