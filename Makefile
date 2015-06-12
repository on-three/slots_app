TARGET=slots.nw
SOURCES:=index.html package.json
SOURCES+=$(wildcard Slots_files/*)
SOURCES+=$(wildcard js/*)
SOURCES+=$(wildcard css/*)
SOURCES+=$(wildcard img/*)

$(TARGET): $(SOURCES)
	zip $(TARGET) $(SOURCES)
	
clean:
	rm $(TARGET)

run:
	nw $(TARGET) --enable-transparent-visuals --disable-gpu
