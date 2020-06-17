<script>
 import { onMount } from 'svelte';
 import html2docx from './html2docx';

 const dec = new TextDecoder('utf-8')

 function bufferToHex (buffer) {
     return [...new Uint8Array (buffer)]
         .map (b => b.toString (16).padStart (2, "0"))
         .join ("");
 }

 function download(filename, data, type="application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
	 const blob = new Blob([data.buffer], {type})
	 const element = document.createElement('a');
	 element.setAttribute('href', URL.createObjectURL(blob));
	 element.setAttribute('download', filename);

	 element.style.display = 'none';
	 document.body.appendChild(element);

	 element.click();

	 document.body.removeChild(element);
 }

 async function handleInput() {
	 for (let i in this.files) {
		 const file = this.files[i]
		 const buf = await file.arrayBuffer()
		 const text = dec.decode(buf)
		 const docx = await html2docx.create(text)
		 download(`${file.name}.docx`, docx)
	 }
	 console.error(this.files)
 }
</script>

<main>
	<h1>sube tu HTML</h1>
	<figure>
		<p>
			subi tu archivo aca:
			<input type="file" on:change={handleInput}/>
		</p>
		<img alt='Success Kid' src='successkid.jpg'>
	</figure>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
