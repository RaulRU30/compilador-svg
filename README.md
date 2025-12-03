# Proyecto Final -- Compilador SBN

Universidad Politécnica de San Luis Potosí\
Materia: Compiladores

Este proyecto implementa un compilador sencillo para un lenguaje de
dibujo denominado SBN. El compilador realiza las fases clásicas:
análisis léxico, análisis sintáctico, transformación del AST y
generación de código SVG. A partir de instrucciones como `Papel`,
`Lapiz` y `Linea`, el compilador produce un archivo de salida
`dibujo.svg`.

## Ejecución

Se requiere Node.js para ejecutar los siguientes comandos:

1.  Instalar dependencias:

    ``` bash
    npm install
    ```

2.  Ejecutar en modo desarrollo:

    ``` bash
    npm run dev
    ```

3.  Compilar y ejecutar:

    ``` bash
    npm run compile:run
    ```

4.  Ejecutar con un archivo de entrada:

    ``` bash
    npm run dev -- archivo.sbn
    ```

El resultado se genera como un archivo SVG en la raíz del proyecto.

## Integrantes del equipo

-   Saucedo Sabino Angel Eduardo - 178974\
-   Mendoza Villalobos Karen Andrea - 179026\
-   Garcia Torres Cristopher - 178666\
-   Reyes Urbina Raul - 174104
