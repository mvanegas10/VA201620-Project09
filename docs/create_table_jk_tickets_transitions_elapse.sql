create table tickets (ticket_id INTEGER, 
	current_state varchar(60),
	next_state varchar(60),
	time_begin_current timestamp,
	time_finish_current timestamp,
	time_finish_next timestamp,
	duration numeric,
	object_id numeric,
	estacion varchar(60),
	patio varchar(120),
	ticket_typo varchar(60)
)