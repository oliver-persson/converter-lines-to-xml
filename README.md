# converter-lines-to-xml
A converter that builds a XML-structure from a linebased fileformat

## How to run
1. npm install
2. npm start
3. result shown in output.xml

## Example
Fileformat:
P|firstname|lastname
T|mobile|telephone
A|street|city|postalnumber
F|name|year
P can be followed by T, A and F
F can be followed by T and A
Example:
P|Carl Gustaf|Bernadotte
T|0768-101801|08-101801
A|Drottningholms slott|Stockholm|10001
F|Victoria|1977
A|Haga Slott|Stockholm|10002
F|Carl Philip|1979
T|0768-101802|08-101802
P|Barack|Obama
A|1600 Pennsylvania Avenue|Washington, D.C

Gives XML as:
<people>
  <person>
    <firstname>Carl Gustaf</firstname>
    <lastname>Bernadotte</lastname>
    <address>
      <street>Drottningholms slott</street>
      ...
     </address>
    <phone>
      <mobile>0768-101801</mobile>
      ...
    </phone>
    <family>
      <name>Victoria</name>
        <born>1977</born>
        <address>...</address>
     </family>
     <family>...</family>
  </person>
  <person>...</person>
</people>