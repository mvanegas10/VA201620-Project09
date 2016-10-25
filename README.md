# Visual Analytics Project - Group 09

This is the final project of the [Visual Analytics course](http://johnguerra.co/classes/isis_4822_fall_2016/) in [Universidad de los Andes](http://www.uniandes.edu.co/). This project aims to solve a real problem through a visual analytics application. 

## Project definition

Along this project we will be working with Recaudo Bogotá S.A.S. This enterprise won the pledge for operating 'Sistema de Recaudo' during 17 years. Their mission is to give Bogota citizens an intelligent and quality transportation service, trying to improve their quality life. 
This business is focused on the different services that a variety of cards offer:
- Basic card: The user is nos identified and does not offer any other service beside the opportunity to use the public transport.
- Plus card: It has the name and identification of the user and gives them the option to have discount on transfer.
- Plus special card: This one is special for the elderly citizens, additional it has the picture of the person and gives him special discounts.

## Data Characterization

We have access to 2 different datasets:

- Incident ticket information: This dataset is a **table**. Each item in the table has 5 **ordered attributes** (initial timestamp, final timestamp, priority, firstResponse, busNumber) and 9 **categorical attributes** (state, inCharge, proprietary, clientName, service, type,station, yard, typeOfFailure).
- Buses information: This dataset is a **table**. Each item in the table has 2 **ordered attributes** (busId, yearBeginWorking) and 3 **categorical attribute** (idEquipmentOnBoard, yearEquipmentOnBoard, stateEquipmentOnBoard).
 
 
We identified 6 different tasks:
 
- T1. **Present trends** of the total response time of all tickets (by type of incident).
- T2. **Compare similarity** of the average response time, for each state in a defined range of time (week, day or hour), with the expected, which is the exact same range in the past month. 
- T3. **Identify outliers** from the response time in a defined range of time. 
- T4. **Browse outliers** from the response time filtering by operator, rush hour VS valley hour.
- T5. **Compare distribution** of time for different tickets choosing the combination of states, based in the time that is selected in the filter. 
- T6. **Lookup** a single ticket  with the corresponding delay between each of the different states. 
 
## First Solution Approach
For all tasks it is necessary to have in mind that in every moment the user can filter by any combination of states of the incident, with an starting point of all the states.

- For <ins>T1</ins> we are going to use a stacked bar chart, using the type of incident as a categorical attribute for **align, separate and order** in the y axis. On the other hand, we are using the states of the ticket as a second categorical attribute for **separating** the line using the **color hue** as the channel. Finally, the quantitative attribute of time is going to be encoded with the **length** of the **line**.
- For <ins>T2</ins> the user will have a filter to choose the period of time (month, day or hour) which depends of the availability of the data, using the same graph but adding a new stacked bar for each type of incident, representing the expected value. This new stacked bars are going to have their name in the ‘y axis’ to difference the expected from the actual period.   
- For <ins>T3, T4</ins> we will use a scatterplot in order to display all the tickets generated in an specific range of time. The user will be able to filter the data according to each state. Using this idiom, we will be representing the amount of time, ordinal value, with the **position in the vertical scale**, the **position in the horizontal scale** will represent the timestamp. The **color hue** will categorize each point in an specific incident. The range filters will be given as a result of the **interaction** with the first visualization. In addition, the user can click in an specific ticket in order to **present the details**.
- On the other hand, for <ins>T5</ins> we are using a line chart, the user will select a maximum of 5 tickets from the scatterplot. We will use the categorical attribute state of the ticket, on the x axis it will be **aligned, separated and ordered**. Also, we will use the **vertical position** of the line to represent the time that took a ticket on that state. Finally, there is going to be a line for each ticket and are going to be differentiated by **color hue**.
- Finally, for <ins>T6</ins> we will use a table and single horizontal bar. The table will present the principal information of the selected ticket  like: the operator, the type of incident, dates (initial and final). And the single bar chart will be used to represent the total delay. The **length** will be the principal channel, representing the total delay and the different states of the incident will be represented by the **color hue**.  For this task all the states will be represented, but the states that are no chosen by the user will be colored grey.

## Mockup
[Mockup](docs/mockup.png)

## References
- Recaudo Bogota: Negocio. [Available here](http://conexion.recaudobogota.com/content/negocio).
- IDECA: Portal Mapas. [Available here](http://mapas.bogota.gov.co/portalmapas/).
- Google Transit. [Available here](https://www.google.com/maps?saddr=Calle+185%2C+Bogot%C3%A1%2C+Colombia&daddr=Universidad+de+los+Andes+-+edificio+Mario+Laserna%2C+Bogot%C3%A1%2C+Colombia&ie=UTF8&f=d&sort=def&dirflg=r&hl=en).

## Contributors
<!-- Contributors table START -->
| [![Laura Cortés](https://avatars.githubusercontent.com/LauraCortes?s=100)<br /><sub>Laura Cortés</sub>](https://github.com/LauraCortes)<br />| [![Anamaria Mojica](https://avatars.githubusercontent.com/aiMojica10?s=100)<br /><sub>Anamaria Mojica</sub>](https://github.com/aiMojica10)<br />| [![Meili Vanegas](https://avatars.githubusercontent.com/mvanegas10?s=100)<br /><sub>Meili Vanegas</sub>](https://github.com/mvanegas10)<br /> |
| :---: | :---: | :---: |

<!-- Contributors table END -->
