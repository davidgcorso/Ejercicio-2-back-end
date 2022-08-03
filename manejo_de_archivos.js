const fs = require('fs/promises');

class Container {
    constructor(ruta){
        this.ruta = ruta
    }

    async listaProductos(){
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8');
            return JSON.parse(objs);
        } catch (error) {
            return []
        }
    }

    async save(obj){
        try {
            const objs = await this.listaProductos();

            let newId;
            if (objs.length == 0) {
                newId = 1
            } else {
                newId = objs[objs.length - 1].id + 1
            }
    
            const newObj = {id: newId, ...obj}
            objs.push(newObj);
    
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
            return newId;
        } catch (error) {
            console.log('No guardó')
        }
    }

    async getById(num){
        try {
            const objs = await this.listaProductos();

            if (num == objs.id) {
                var item = objs.find(item => item.id === num);
                return console.log(item);
                
            } else {
                return console.log('No existe este producto');
            }
        } catch (error) {
            
        }
    }

    async DeleteById(id){
        try {
            const objs = await this.listaProductos();
            const indexObj = objs.findIndex((o)=> o.id == id);

            if (indexObj == -1) {
                return 'No existe este producto'
            } else {
                objs.splice(indexObj, 1);
                await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2)); 
            }
        } catch (error) {
            
        }
    }
}

async function main(){
    const container = new Container('./archivos/sync_data.txt');

    console.log('Productos')
    console.log(await container.listaProductos())
    console.log('Guardar producto')
    console.log(await container.save({title: "Metralleta", price: 666, thumbnail: 'https://i.ytimg.com/vi/u38ne0dRTws/maxresdefault.jpg', id:4}))
    console.log('Productos actuales')
    console.log(await container.listaProductos());
    console.log('Eliminar por Id')
    console.log(await container.DeleteById(2));
    console.log('Productos actuales')
    console.log(await container.listaProductos());
}
main();
