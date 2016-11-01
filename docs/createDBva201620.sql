


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
  ,comments                 VARCHAR(46)
  ,tn                       INTEGER  
  ,title                    VARCHAR(48) 
  ,service_id               INTEGER  
  ,sla_id                   VARCHAR(4) 
  ,customer_id              VARCHAR(39) 
  ,customer_user_id         VARCHAR(14) 
  ,timeout                  INTEGER  
  ,alarm_code               VARCHAR(4) 
  ,device_id                VARCHAR(8) 
);