CREATE TABLE tickets(
   id                       INTEGER  NOT NULL PRIMARY KEY 
  ,name                     VARCHAR(78) 
  ,history_type_id          INTEGER  
  ,ticket_id                INTEGER  
  ,article_id               VARCHAR(7) 
  ,type_id                  INTEGER  
  ,queue_id                 INTEGER  
  ,owner_id                 INTEGER  
  ,priority_id              INTEGER  
  ,state_id                 INTEGER  
  ,valid_id                 BIT  
  ,create_time              VARCHAR(19) 
  ,create_by                INTEGER  
  ,change_time              VARCHAR(19) 
  ,change_by                INTEGER
  ,name_1		    VARCHAR(78)  
  ,comments                 VARCHAR(46)
  ,type_id_1		    INTEGER
  ,tn                       INTEGER  
  ,title                    VARCHAR(48) 
  ,service_id               INTEGER  
  ,sla_id                   VARCHAR(4)
  ,ticket_state_id	    INTEGER 
  ,customer_id              VARCHAR(39) 
  ,customer_user_id         VARCHAR(14) 
  ,timeout                  INTEGER  
  ,alarm_code               VARCHAR(4) 
  ,device_id                VARCHAR(8) 
);