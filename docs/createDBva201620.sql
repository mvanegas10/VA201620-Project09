CREATE TABLE tickets(
   id                       INTEGER  NOT NULL PRIMARY KEY 
  ,name                     VARCHAR(78) NOT NULL
  ,history_type_id          INTEGER  NOT NULL
  ,ticket_id                INTEGER  NOT NULL
  ,article_id               VARCHAR(7) NOT NULL
  ,type_id                  INTEGER  NOT NULL
  ,queue_id                 INTEGER  NOT NULL
  ,owner_id                 INTEGER  NOT NULL
  ,priority_id              INTEGER  NOT NULL
  ,state_id                 INTEGER  NOT NULL
  ,valid_id                 BIT  NOT NULL
  ,create_time              VARCHAR(19) NOT NULL
  ,create_by                INTEGER  NOT NULL
  ,change_time              VARCHAR(19) NOT NULL
  ,change_by                INTEGER  NOT NULL
  ,id_1                     INTEGER  NOT NULL
  ,name_1                   VARCHAR(33) NOT NULL
  ,comments                 VARCHAR(46)
  ,type_id_1                INTEGER  NOT NULL
  ,valid_id_1               BIT  NOT NULL
  ,create_time_1            VARCHAR(19) NOT NULL
  ,create_by_1              INTEGER  NOT NULL
  ,change_time_1            VARCHAR(19) NOT NULL
  ,change_by_1              INTEGER  NOT NULL
  ,visible_mobile           BIT  NOT NULL
  ,id_2                     INTEGER  NOT NULL
  ,tn                       INTEGER  NOT NULL
  ,title                    VARCHAR(48) NOT NULL
  ,queue_id_1               INTEGER  NOT NULL
  ,ticket_lock_id           BIT  NOT NULL
  ,ticket_answered          BIT  NOT NULL
  ,type_id_2                INTEGER  NOT NULL
  ,service_id               INTEGER  NOT NULL
  ,sla_id                   VARCHAR(4) NOT NULL
  ,user_id                  INTEGER  NOT NULL
  ,responsible_user_id      BIT  NOT NULL
  ,group_id                 BIT  NOT NULL
  ,ticket_priority_id       INTEGER  NOT NULL
  ,ticket_state_id          INTEGER  NOT NULL
  ,group_read               VARCHAR(4) NOT NULL
  ,group_write              VARCHAR(4) NOT NULL
  ,other_read               VARCHAR(4) NOT NULL
  ,other_write              VARCHAR(4) NOT NULL
  ,customer_id              VARCHAR(39) NOT NULL
  ,customer_user_id         VARCHAR(14) NOT NULL
  ,timeout                  INTEGER  NOT NULL
  ,until_time               BIT  NOT NULL
  ,escalation_time          BIT  NOT NULL
  ,escalation_update_time   BIT  NOT NULL
  ,escalation_response_time BIT  NOT NULL
  ,escalation_solution_time BIT  NOT NULL
  ,valid_id_2               BIT  NOT NULL
  ,archive_flag             BIT  NOT NULL
  ,create_time_unix         INTEGER  NOT NULL
  ,create_time_2            VARCHAR(19) NOT NULL
  ,create_by_2              INTEGER  NOT NULL
  ,change_time_2            VARCHAR(19) NOT NULL
  ,change_by_2              INTEGER  NOT NULL
  ,alarm_code               VARCHAR(4) NOT NULL
  ,device_id                VARCHAR(8) NOT NULL
);

INSERT INTO tickets(id,name,history_type_id,ticket_id,article_id,type_id,queue_id,owner_id,priority_id,state_id,valid_id,create_time,create_by,change_time,change_by,id_1,name_1,comments,type_id_1,valid_id_1,create_time_1,create_by_1,change_time_1,change_by_1,visible_mobile,id_2,tn,title,queue_id_1,ticket_lock_id,ticket_answered,type_id_2,service_id,sla_id,user_id,responsible_user_id,group_id,ticket_priority_id,ticket_state_id,group_read,group_write,other_read,other_write,customer_id,customer_user_id,timeout,until_time,escalation_time,escalation_update_time,escalation_response_time,escalation_solution_time,valid_id_2,archive_flag,create_time_unix,create_time_2,create_by_2,change_time_2,change_by_2,alarm_code,device_id) VALUES (30159732,'%%Note',15,494183,'6502695',12,28,314,4,22,1,'2016-05-01 00:00:01',188,'2016-05-01 00:00:01',188,22,'EN PROCESO DE ALISTAMIENTO',NULL,2,1,'2013-02-24 20:15:01',35,'2013-02-24 20:15:01',35,0,494183,10494214,'REPOSICION ALMACEN SATELITE TIKET 10491750',28,1,0,12,212,NULL,314,1,1,4,25,NULL,NULL,NULL,NULL,'ZONAL::ETIB','etib',1462098800,0,0,0,0,0,1,0,1462028071,'2016-04-30 09:54:31',314,'2016-05-01 05:33:20',188,NULL,NULL);