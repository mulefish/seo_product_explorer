# run it
cli: python main.py 
browser: localhost:9090

# use it        
Mouse around in the viewport; You will see a metro style picker to indicate which bubble is under-examination; click for details 

# What will this do?
It will read information from the 'create_clusters' directory and created a html5 canvas to see the various clusters 

# What are the colors for?   
In the source datastore all products belong to 1 of 12 ( or so ) different 'product categories' such as 'tennis' or 'outdoors' etc etc. 
Each of those categories was assigned an arbituary color. The bubbles in the KNN graph reflect that averaged color on the products represented by that bubble's collected affinity products 

# What is the size of the bubbles for?  
The size of the bubble reflects how many collected affinity products were discovered     



